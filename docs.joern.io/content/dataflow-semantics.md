---
id: dataflow-semantics
title: Custom Data-Flow Semantics
weight: 145
---

# Motivation

In order to precisely model a program's behaviour we would require a whole-program analysis. This
premise is largely sound, but to compute the whole execution environment includes modelling
third-party dependencies and native operations directly on the operating system.

This is expensive and non-trivial in practice, and Joern contains mechanisms to perform program
analysis well. One such solution is being able to define semantics for methods where their
definitions are not modelled in the analysis. However, to remain sound, Joern will treat external
methods with no semantic definitions as able to propagate taint from all arguments, to all arguments
including the return value.

## Example

In the following example, we have a call from object `foo` to some external call to `bar`, where `x`
is assigned to the return value, and `a` and `b` are the arguments.

```python
a = "MALICIOUS"
foo = Foo()
x = foo.bar(a, b)
# True positives
print(a)
print(x)
# False positives
print(b)
print(foo)
``` 

Let's assume the call to `bar` results in taint in `a` propagating to `x`. Without a semantic
definition, Joern will propagate taint from `a` to itself and `x`, `foo`, and `b`. While this is
sound, it is imprecise, and could result in `reachableBy` returning additional and unrelated paths.

# Defining Custom Semantics

The semantic definition language is fairly rudimentary. It allows a user to express explicit
dataflow paths between arguments, where any missing flows are assumed killed.

Semantics can be defined programmatically, as is done in
[`DefaultSemantics`](https://github.com/joernio/joern/blob/master/dataflowengineoss/src/main/scala/io/joern/dataflowengineoss/DefaultSemantics.scala),
or parsed from a simple grammar via
[`semanticsloader/Parser`](https://github.com/joernio/joern/blob/master/dataflowengineoss/src/main/scala/io/joern/dataflowengineoss/semanticsloader/Parser.scala).

## Basic Syntax

The basic syntax of semantics is the method full name, followed by argument pairs denoting
source-destination pairs, e.g., `"foo" 1->-1 2->3`. `-1` is the return value, and `0` is the
receiver/base of the call (relevant for object-oriented programming languages), where everything `>
0` is the call's arguments.

Following from the example above, the semantic definition for `x = foo.bar(a, b)` would look
something like `Foo.bar 1->-1 0->0 1->1 2->2`. While the first entry is rather intuitive (flow from
argument 1 propagates to the return value), the last three simply reiterate that the data-flow in the
other arguments are not to be killed at this call site.

## Named Arguments

Some languages allow for named arguments instead of only positional ones. For this, we allow the
optional definition of the parameter name using the following syntax:

```scala
"foo" 1 "param1"->2 3 -> 2 "param2"
```

This should allow taint in the call `foo(param1="MALICIOUS", a)` to map flow from `"MALICIOUS"` to
argument `a`, as well as taint in `foo(param2=b, param1=a, param3="MALICIOUS")` to map `"MALICIOUS"`
to argument `b`.

Every mapping must have an argument index, but following this, a parameter name can be supplied. The
parameter name takes precedence when interpreting the rule at a matching call site.

## Regex Matching

In some cases, calls cannot be resolved to their call sites, and thus the method full name will not
be fully present. The type recovery system that is currently in place, may instead attempt to reconstruct a plausible path which one can match against instead, e.g., in Python we may see

```python
from path import sanitizer

source = 1
# This should kill the flow from 1 -> -1, but not sanitize the argument pointer
x = sanitizer(source) 
sink(x)
```

We can add the following flow to the data-flow engine context, where the method full name should be
interpreted as a regex.
```scala
val extraFlows = List(
    FlowSemantic.from(
        "^path.*<module>\\.sanitizer$", // Method full name
        List((1, 1)), // Flow mappings
        regex = true  // Interpret the method full name as a regex string
    )
)

val context = new LayerCreatorContext(cpg)
val options = new OssDataFlowOptions(extraFlows = extraFlows)
new OssDataFlow(options).run(context)
```

## Passthrough Mapping

A new feature added to reduce the overhead of reiterating self-taint, e.g. `1->1`, especially in the
case of variadic arguments, the `PASSTHROUGH` syntax was added, e.g., `"foo" PASSTHROUGH 0 -> 0` or
`FlowSemantic("foo", List(PassThroughMapping))`.

This represents an instance where arguments are not sanitized, may affect the return value, and do
not cross-taint. e.g. `foo(1, 2) = 1 -> 1, 2 -> 2, 1 -> -1, 2 -> -1`. Note this does not map `0->0`.

## Notes on `order` vs `argumentIndex`

`argumentIndex` != `order`. `order` is based on the position of the node in relation to its AST
siblings. `argumentIndex` is similar but refers to the order with respect to AST siblings joined to
the AST parent call via an additional `ARGUMENT` edge. This is usually > 0 and the receiver (in OOP)
has a `RECEIVER` edge in addition to the AST edge.

The semantic language interprets the argument positions using `argumentIndex` and not `order`!
