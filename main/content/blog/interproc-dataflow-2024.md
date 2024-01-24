---
title: "How Interprocedural Data-flow Works in Joern"
date: 2024-01-24
author: "David Baker Effendi"
email: "dave@whirlylabs.com"
---

In case you were wondering, Joern supports data-flow across procedure (and file) boundaries. This is
based on preprocessing step of intraprocedural data-flow slicing done in parallel, followed by
on-the-fly symbol tracking during query time. These are mainly accessed via [data-flow query
steps](https://docs.joern.io/cpgql/data-flow-steps/).

During these data-flow query steps, the main mechanisms at play are the [call
resolver](https://github.com/joernio/joern/blob/master/semanticcpg/src/main/scala/io/shiftleft/semanticcpg/language/ICallResolver.scala)
and [pre-defined semantics](https://docs.joern.io/dataflow-semantics/). These, along with the given
source and sink traversals, are how you will achieve successful and precise interprocedural
data-flow analysis.

## Call Graphs in the CPG

The call resolver mechanism influences how the [call steps](https://docs.joern.io/cpgql/calls/)
work. For Joern-generated CPGs, the design decision we've opted for is a pre-generated call graph.
This is useful for analysis that want to ingest the CPG in some complete form, and give a more
"complete" CPG. This leads to faster interprocedural data-flow analysis as the calls have already
been resolved (to some degree). The downside is that the CPG generation will take longer, and for
dynamic languages, potentially involve a type-recovery step which is expensive. 

### Call Resolvers

This default behaviour is enabled with the implicit
[NoResolve](https://github.com/joernio/joern/blob/18017fd0b057fd19edc690ca9d29b5be3b8d01c3/semanticcpg/src/main/scala/io/shiftleft/semanticcpg/language/ICallResolver.scala#L72)
class which simply follows the pre-defined `CALL` edges if present. These schema edges take the form
of `CALL -(CALL)-> METHOD`.

If you would like to build something more on-the-fly, like a points-to analysis to resolve types and
calls, you would simply need to implement
[ICallResolver](https://github.com/joernio/joern/blob/master/semanticcpg/src/main/scala/io/shiftleft/semanticcpg/language/ICallResolver.scala).
This may be beneficial in dynamic languages, where pre-computing types may not always be feasible.

### External Calls

One important aspect of note, is that when a call-site cannot be resolved to a method, a bare-bones
`METHOD` stub node is associated with it. This failure to resolve the method may be due to the call
graph analysis, or simply that it is some external library not included in the given code analysed
by Joern.

If this is the case, the method node will have a property `isExternal = true` and one will not be
able to obtain reliable information such as parameter names or modifiers. However, this is a good
way to identify potential sensitive sources, as many of these present themselves via external
dependencies.

In terms of how Joern sees data-flow to-and-from these calls, this will be discussed under the next
heading.

## Semantics

A more extensive write-up of the semantics can be found in the
[documentation](https://docs.joern.io/dataflow-semantics/), but in the following, a basic
description of how the data-flow engine interacts with these will be discussed.

### Handling External Methods

When the data-flow engine tracks data-flow to a call-site, it needs to understand how data going in
and out of the invocation will flow. For internally defined methods, this can simply be tracked
within the CPG. For externally defined (or unresolvable) methods, this will be (soundly)
overapproximated to propagate the taint to and from all parameters and return values. 

The overapproximation will lead to imprecision, so Joern allows for simple method summaries to be
defined. If a method cannot be internally resolved, Joern looks up the method against the list of
default and user-supplied custom semantic definitions. These semantics prevent the data-flow engine
from simply overapproximating which gives both a boost to precision and performance.

## Examples

The following provides some query and testing tips around interprocedural data-flow tracking.

### Performant Source-Sink Matching

If the language you are analysing is well-supported by Joern, then it would be safe to define your
sources and sinks in the following way, e.g., for attacker controlled headers in
`HttpServletRequest`:

```scala
cpg.typeDecl
  .fullNameExact("javax.servlet.http.HttpServletRequest")
  .method
  .nameExact("getHeader")
  .callIn
  .l // Gives us a `List[Call]` in the end
```

The graph is indexed by node labels, and the number of nodes in the `CALL` set generally far
outnumber those in the `METHOD` or `TYPE_DECL` set. So starting from the smaller node set and
jumping across edges will generally graph a performance boost to the query.

However, if the method is stubbed because it is external, then there will be no `TYPE_DECL` node
connected to it, as stubs are not part of an AST. We can then do:

```scala
cpg.method
  .fullName("javax.servlet.http.HttpServletRequest.getHeader.*") 
  .callIn
  .l
```

When calling the `fullName` step without the `Exact` prefix, we enable the slower (but more
flexible) regex-enabled string search. Here we use regex to ignore the signature part of the full
name. Signatures are part of method full names for languages that have overriding.

However, if the call graph is unable to resolve methods, we may need to eventually match against the
set of all call nodes.

```scala
cpg.call
  .methodFullName("javax.servlet.http.HttpServletRequest.getHeader.*") 
  .l
```

This is generally a bit slower, but are robust to languages that are prone to unresolved call-sites.

### Testing with `ScalaTest`

One can import Joern's test fixtures into their Joern-based static analysis tool by adding the 
following lines in their `build.sbt`:

```scala
libraryDependencies ++= Seq(
  // Core test dependencies
  "io.joern" %% "semanticcpg" % Versions.joern % Test classifier "tests",
  "io.joern" %% "x2cpg" % Versions.joern % Test classifier "tests",
  "io.joern" %% "dataflowengineoss" % Versions.joern % Test classifier "tests",
  // Whatever language frontend...
  "io.joern" %% "javasrc2cpg" % Versions.joern % Test classifier "tests", 
)
```

We can then create our own Scala tests to validate these data-flows.

```scala
class CrossFileFlowsTest extends JavaSrcCode2CpgFixture(withOssDataflow = true) {
  "A flow between files" should {

    val cpg = code(
      """
        |package crossfiletest;
        |import javax.servlet.http.HttpServletRequest;
        |public class Request {
        |    public static String getTheHeader(HttpServletRequest request) {
        |        return request.getHeader("some-header-name"); // `getHeader` is our source
        |    }
        |}
        |""".stripMargin, "crossfiletest/Request.java").moreCode(
      """
        |
        |package crossfiletest;
        |import javax.servlet.http.HttpServletRequest;
        |public class Main {
        |    public void processRequest(HttpServletRequest request) {
        |        String query = Request.getTheHeader(request); // `query` is our sink
        |    }
        |}
        |""".stripMargin, "crossfiletest/Main.java")

    "be found by the data-flow engine" in {
      val source = cpg.method
        .fullName(".*HttpServletRequest.getHeader.*")
        .where(_.isExternal)
        .callIn
        .l
      val sink = cpg.assignment
        .where(_.target.isIdentifier.nameExact("query"))
        .l

      sink.reachableBy(source).size should be > 0
    }

}
```

We can visualize the flows by changing the query to pretty-print to console using
`sink.reachableByFlows(source).p.foreach(println)`.

```
__________________________________________________________________________________________________________
| nodeType     | tracked                        | lineNumber| method         | file                       |
|=========================================================================================================|
| Call         | getHeader("some-header-name")  | 6         | getTheHeader   | crossfiletest/Request.java |
| Return       | // replace "some-header-nam... | 6         | getTheHeader   | crossfiletest/Request.java |
| MethodReturn | RET                            | 5         | getTheHeader   | crossfiletest/Request.java |
| Call         | getTheHeader(request)          | 7         | processRequest | crossfiletest/Main.java    |
| Identifier   | String query = getTheHeader... | 7         | processRequest | crossfiletest/Main.java    |
| Call         | String query = getTheHeader... | 7         | processRequest | crossfiletest/Main.java    |
```

## Conclusion

In this post, we discussed, on a high level, some of the inner workings of the data-flow engines and
what guarantees its success. If you have questions or would like to see more blogs like this, let us
know in the Discord channel!

Happy hunting!
