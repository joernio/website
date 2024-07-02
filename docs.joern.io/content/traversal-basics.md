---
id: traversal-basics
title: Traversal Basics
weight: 40
---

Joern helps you discover security vulnerabilities by executing graph
traversals on the [Code Property
Graph](/code-property-graph). A traversal is formulated
as an _Joern Query_, or _query_ for short. In this article, you will learn about the different components that make up queries.

## The Anatomy of a Joern Query

A query consists of the following components:

1. A _Root Object_, which is the reference to the _Code Property Graph_ being queried
2. Zero or more _Node-Type Steps_, which are atomic traversals to all nodes of a given type
3. Zero or more _Filter Steps_, _Map Steps_ or _Repeat Steps_
5. Zero or more _Property Directives_, which reference the properties of nodes in a traversal
6. Zero or more _Execution Directives_, which execute a traversal and return results in a specific format
7. Zero or more _Augmentation Directives_, which extend a Code Property Graph with new nodes, properties, or edges

Finally, components 2-7 can be combined into Complex Steps in the same way basic expressions of a programming language can be combined into complex expressions.

As an example, the query

```java
cpg.method.name.toList
```
returns all names of methods present in a Code Property Graph and can be dissected as follows: `cpg` is the root object, `method` is a node-type step which references all `METHOD` nodes, `name` is a property directive which references the `NAME` property of those `METHOD` nodes, and `toList` is an execution directive which executes the traversal and returns the result as a list.


### Importing a Sample Project

Before we go into the details of these components, let us import a sample program. Clone the following git repository which contains the _Java_ implementation of a simple program named `X42`:

```bash
$ git clone https://github.com/ShiftLeftSecurity/x42.git
```

Start Joern and specify a 4GB JVM heap size using the `JAVA_OPTS` environment variable:

```bash
$ JAVA_OPTS='-Xmx4g' joern
```

Then create a [Project](/organizing-projects) from the JAR file of the `X42` program using the `importCode` top-level command:

```java
joern> importCode("./x42/c/", "x42")
Creating project `x42` for code at `x42/c/`
... output omitted
res0: Option[Cpg] = Some(io.shiftleft.codepropertygraph.Cpg@31ed46c5)
```

## A First Traversal

For our first traversal, our objective is to determine the `LANGUAGE` property of the `METADATA` node in the Code Property Graph of the `X42` program. At the Joern prompt, type `cpg` and press `ENTER`:

```java
joern> cpg 
res1: Cpg = io.shiftleft.codepropertygraph.Cpg@ab90fdab
```

The executed query consists only of the root object `cpg`. The return value of that execution is a reference to the Code Property Graph and  the reference itself is suffixed by a hexadecimal string (in this case `@ab90fdab`) that uniquely identifies it. We proceed to add the `metaData` node-type step to the query. This step represents a traversal to all nodes of type `METADATA` (of which there is only one):

```java
joern> cpg.metaData 
res2: Traversal[MetaData] = Traversal
```

Note that the result is not the content of the `METADATA` node, but a traversal that visits the `METADATA` node. In other words, Traversals are lazily evaluated - you can compose them and at some later point execute them, as we will see.

This behaviour points to the ephemeral nature of queries: each query is separate from the other, and Joern holds distinct in-memory representations for them. The only object shared between queries is the root object (`cpg`).

Traversals are executed - as opposed to just to being held in memory - using execution directives such as `toList`. The directive `toList` executes the traversal and returns results in a list: 

```java
joern> cpg.metaData.toList 
res3: List[MetaData] = List(
  MetaData(
    id -> 1L,
    hash -> None,
    language -> "NEWC",
    overlays -> List("semanticcpg"),
    version -> "0.1"
  )
)
```

In the result of this query, we already see the `LANGUAGE` field and that it is `C`. For the sake of completeness and to illustrate property directives, let us add the property directive `language` to the query. Property directives provide access to individual node properties. Each node-type step can be combined with different property directives, and they usually match the properties defined on the node type represented by the node-type step:
```java
joern> cpg.metaData.language.toList 
res4: List[String] = List("NEWC")
```

With this last query, we have achieved our goal of executing a traversal which returns the `LANGUAGE` property of the `METADATA` node of the `X42` program.

### Node-Type Steps

Node-Type Steps are atomic traversals that represent traversals to nodes of a given type. Each node-type step comes with distinct _Property Directives_ to access the properties of the nodes they represent. Let us revisit the source code of the `x42` program to illustrate node-type steps.

```c
// X42.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[]) {
  if (argc > 1 && strcmp(argv[1], "42") == 0) {
    fprintf(stderr, "It depends!\n");
    exit(42);
  }
  printf("What is the meaning of life?\n");
  exit(0);
}
```

A commonly used node-type step is `method`, which represents a traversal to all nodes of type `METHOD`. `METHOD` nodes represent declarations of methods, functions or procedures in programs, and one of their properties is `NAME`. All names of all method nodes can thus be determined as follows:

```java
joern > cpg.method.name.l
res4: List[String] = List(
  "main",
  "fprintf",
  "exit",
  "<operator>.logicalAnd",
  "<operator>.equals",
  "<operator>.greaterThan",
  "strcmp",
  "<operator>.indirectIndexAccess",
  "printf"
)
```

The number of `METHOD` nodes may surprise you, given that the program only defines the single method `main` explicitly. The Code Property Graph, however, also includes method nodes for all methods invoked by the code. Moreover, built-in operators are modeled as methods, one decision made to enable language-agnostic analysis.

We will look into the details of node-type steps in a different article. For now, it is sufficient to know that Joern offers these steps for all common node types: `method`, `call`, `argument`, `parameter`, `metaData`, `local`, `literal`, `types`, `returns`, `identifier`, `namespace`, `namespaceBlock`, `methodReturn`, `typeDecl`, `member`, `methodRef`, `file`, `comment`, `tag` and the generic `all`.


### Filter Steps

_Filter Steps_ are atomic traversals that filter nodes according to given criteria. The most common filter step is aptly-named `filter`,  which continues the traversal in the step it suffixes for all nodes which pass its criterion. Its criterion is represented by a lambda function which has access to the node of the previous step and returns a boolean.  Continuing with the previous example, let us execute a query which returns all `METHOD` nodes of the Code Property Graph for `X42`, but only if their `IS_EXTERNAL` property is set to `false`:

```java
joern> cpg.method.filter(_.isExternal == false).name.toList 
res11: List[String] = List("main")
```

{{< hint info >}}
A note on Scala lambda functions:
In the example above, we used the lambda function `_.isExternal == false` as the predicate for the filter.
The `_` is simply syntactic sugar referring to the parameter of the function, so this could be rewritten
as `method => method.isExternal == false`.
{{< /hint >}}

Dissecting this query, we have `cpg` as the root object, a node-type step `method` which returns all nodes of type `METHOD`, a filter step `where(_.isExternal == false)` which continues the traversal only for nodes which have their `IS_EXTERNAL` property set to `false` (with `_` referencing the individual nodes, and `isExternal` a property directive which accesses their `IS_EXTERNAL` property), followed by  a property directive `name` which returns the values of the `NAME` property of the nodes that passed the _Filter Step_, and finally an _Execution Directive_ `toList` which executes the traversal and returns the results in a list.

A shorter version of a query which returns the same results as the one above can be written using a _Property-Filter Step_. Property-filter steps are _Filter Steps_ which continue the traversal only for nodes which have a specific value in the property the _Property Filter Step_ refers to:

```java
joern> cpg.method.isExternal(false).name.toList 
res11: List[String] = List("main")
```

Dissecting the query again, `cpg` is the root object, `method` is a node-type step, `isExternal(false)` is a property-filter step that filters for nodes which have `false` as the value of their `IS_EXTERNAL` property, `name` is a property directive, and `toList` is the execution directive you are already familiar with.

{{< hint info >}}
Be careful not to mix up property directives with property-filter steps, they look awfully similar.
Consider that:

a) `cpg.method.isExternal(true).name.toList` returns all `METHOD` nodes which have the `IS_EXTERNAL` property set to `true` (in this case, 10 results)

b) `cpg.method.isExternal.toList` returns the value of the `IS_EXTERNAL` property for all `METHOD` nodes in the graph (12 results)

c) `cpg.method.isExternal.name.toList` is an invalid query which will not execute
{{< /hint >}}

A final _Filter Step_ we will look at is named `where`. Unlike `filter`, this doesn't take a simple predicate `A => Boolean`, but instead takes a `Traversal[A] => Traversal[_]`. I.e. you supply a traversal which will be executed at the current position. The resulting Traversal will preserves elements if the provided traversal has _at least one_ result. The previous query that used a _Property Filter Step_ can be re-written using `where` like so:

```java
joern> cpg.method.where(_.isExternal(false)).name.toList 
res24: List[String] = List("main")
```

Maybe not particularly useful-seeming given this specific example, but keep it in the back of your head, because `filter` is a handy tool to have in the toolbox. Next up, _Map Steps_.

### Map Steps

_Map Steps_ are traversals that map a set of nodes into a different form given a function. _Map Steps_ are a powerful mechanism when you need to transform results to fit your specifics. For example, say you'd like to return both the `IS_EXTERNAL` and the `NAME` properties of all `METHOD` nodes in `X42`'s Code Property Graph. You can achieve that with the following query:

```java
joern> cpg.method.map(node => (node.isExternal, node.name)).toList
res6: List[(Boolean, String)] = List(
  (false, "main"),
  (true, "fprintf"),
  (true, "exit"),
  (true, "<operator>.logicalAnd"),
  (true, "<operator>.equals"),
  (true, "<operator>.greaterThan"),
  (true, "strcmp"),
  (true, "<operator>.indirectIndexAccess"),
  (true, "printf")
)
```

Don't be intimidated by the syntax used in the `map` _Step_ above. If you examine `map(node => (node.isExternal, node.name))` for a bit, you might be able to infer that the first `node` simply defines the variable that represents the node which preceeds the `map` _Step_, that the ASCII arrow `=>` is just syntax that preceeds the body of a lambda function, and that `(node.isExternal, node.name)` means that the return value of the lambda is a list which contains the value of the `isExternal` and `name` _Property Directives_ for each of the nodes matched in the previous step and also passed into the lambda. In most cases in which you need `map`, you can simply follow the pattern above. But should you ever feel constrained by the common pattern shown, remember that the function for the `map` step is written in the Scala programming language, a fact which opens up a wide range of possibilities if you invest a little time learning the language.

### Complex Steps

Another useful _Joern Query Component_ is the _Complex Step_. _Complex Steps_ combine many simpler steps into one in order to make your queries more concise. There are a number of them available, all with different behaviours, and one good example is `isConstructor`. Before we use it in a query, here is the `X42` program again:

```java
// X42.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[]) {
  if (argc > 1 && strcmp(argv[1], "42") == 0) {
    fprintf(stderr, "It depends!\n");
    exit(42);
  }
  printf("What is the meaning of life?\n");
  exit(0);
}
```

Earlier we queried it for all `METHOD` nodes which had their `IS_EXTERNAL` property set to `false` using the `isExternal(false)` _Property Filter Step_. Two results came up, even though only one method is explicitly defined:

```java
joern> cpg.method.isExternal(false).name.l 
res103: List[String] = List("main")
```

Two useful _Complex Steps_ are `astParent` and `astChildren`, which allow you to steer your traversals through the abstract syntax tree of the program under analysis. Say you'd like to have a query that returns the `CODE` property for all nodes of type `LITERAL` which are AST child nodes of `CALL` nodes that have `printf` in their `NAME` property:

```java
joern> cpg.call.name("printf").astChildren.isLiteral.code.l
res30: List[String] = List("\"What is the meaning of life?\\n\"")
```

Or taken the other way around, a query which returns the property of all `CALL` nodes which have AST parent nodes of type `LITERAL` that have their `CODE` property set to `\"What is the meaning of life?\"`:

```java
joern> cpg.literal.filter(_.code == "\"What is the meaning of life?\\n\"").astParent.isCall.name.toList
res100: List[String] = List("printf")
```

Describing queries in human language tends to sound peculiar. But so would descriptions of bash one-liners, or basic regular expressions if you'd try out that exercise. As long as you understand the individual components of a query, it won't be hard to construct them correctly and understand clearly what they do.

One final _Joern Query Component_ we'll examine in this article is the _Repeat Step_.

### Repeat Steps

There are cases in which queries have repetitions in them and become too long. In order to make them more readable, you can use _Repeat Steps_. _Repeat Steps_ are traversals that repeat other traversals a number of times.
For example, say you'd like to find nodes of type `LITERAL` in `X42`'s Code Property Graph that are directly reachable from the node which represents the `main` method. One way of doing that is by using five `astChildren` _Complex Steps_ in combination with `isLiteral`, which is another _Complex Step_ that filters for AST nodes of type `LITERAL` and maps them to actual `LITERAL` nodes,  plus the `code("42")` _Property Filter Step_:

```java
joern> cpg.method.name("main").astChildren.astChildren.astChildren.astChildren.astChildren.isLiteral.code("42").toList
res32: List[Literal] = List(
  Literal(
    id -> 1000121L,
    argumentIndex -> 1,
    argumentName -> None,
    code -> "42",
    columnNumber -> Some(value = 9),
    lineNumber -> Some(value = 8),
    order -> 1,
    typeFullName -> "int"
  )
)
```

The query might do the job, but it is hard to read and change. `repeat-times` makes the query clearer:

```java
joern> cpg.method.name("main").repeat(_.astChildren)(_.times(5)).isLiteral.code("42").l
res33: List[Literal] = List(
  Literal(
    id -> 1000121L,
    argumentIndex -> 1,
    argumentName -> None,
    code -> "42",
    columnNumber -> Some(value = 9),
    lineNumber -> Some(value = 8),
    order -> 1,
    typeFullName -> "int"
  )
)
```

And even better is another variant of `repeat`, namely `repeat-until`:

```java
joern> cpg.method.name("main").repeat(_.astChildren)(_.until(_.isLiteral.code("42"))).l
res34: List[AstNode] = List(
  Literal(
    id -> 1000121L,
    argumentIndex -> 1,
    argumentName -> None,
    code -> "42",
    columnNumber -> Some(value = 9),
    lineNumber -> Some(value = 8),
    order -> 1,
    typeFullName -> "int"
  )
)
```

:::info
Joern traversals implement Scala's `IterableOps` trait. It is therefore possible to use all of the
methods listed in the [IterableOps documentation](https://www.scala-lang.org/api/2.13.3/scala/collection/IterableOps.html)
on Traversals.
:::

We won't go any further in this article. If you've read so far, you already have a good overview of the most important _Joern Query Components_. And while the examples you've seen focused on the simple `X42` program, rest assured, queries that find serious vulnerabilities in programs with millions of lines of code are not much different. Master these basics and you will already have found a strong tool in your code analysis arsenal. As soon as you feel ready, explore the more advanced walkthroughs for a level-up. Have fun!
