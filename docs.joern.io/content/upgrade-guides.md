---
id: upgrade-guides
title: Upgrade Guide
weight: 150
---


## 1.1.1: OverflowDb Traversals
This release introduces a major rearchitecture of the cpg query language (CPGQL). Most changes happened under the hood, however there are a few changes that are user facing. The migration should be straightforward, and in any case we're here to help.

Background: CPGQL was previously based on the [Gremlin graph traversal language](https://tinkerpop.apache.org/gremlin.html) (accessible via `.raw`), and is now based on [OverflowDb Traversal](https://github.com/ShiftLeftSecurity/overflowdb/blob/master/traversal/src/main/scala/overflowdb/traversal/Traversal.scala). The main drivers behind this change are: better performance, less complexity and fewer dependencies. OverflowDb Traversal is a Scala collection with additional graph steps, which means we now inherit many useful steps from the rich Scala standard collection library, where previously conversions between Traversal and Scala collections were needed.
At the same time, Traversal offers largely the same steps and semantics as its TinkerPop predecessor. 

Here are the most important new parts - from our experience the swap of `filter` and `where` accounts for 90% of user-facing changes:

1. `filter(A => Boolean)`: just like any other Scala collection, filter now simply takes a predicate (it used to take a Traversal). 

2. `where(trav: Traversal[A] => Traversal[_])`: preserves elements if the provided traversal has at least one result. This is what filter used to be.
*Effectively, `filter` and `where` are swapped*. 

3. RIP `filterOnEnd` - this is now simply `filter`

4. `repeat` now has a builder DSL to configure it's behaviour, which is more specific and easier to understand than Tinkerpop's API, which relied on the order of modulators in the traversal. 
For example, in tinkerpop `.emit.repeat(Traversal)` means "emit everything", while `.repeat(Traversal).emit` means "emit all but the first element". 
In OverflowDb Traversal this behaviour is more explicit: `.repeat(Traversal)(_.emit)` and `.repeat(Traversal)(_.emitAllButFirst)`.

Some more examples for the migration: 
* `.repeat(x).until(y)` -> `.repeat(x)(_.until(y))`
* `.emit.repeat(x)` -> `.repeat(x)(_.emit)`
* `.repeat(x).emit` -> `.repeat(x)(_.emitAllButFirst)`
* `.emit.repeat(x).times(2)` -> `.repeat(x)(_.emit.times(2))`

5. `repeat` uses depth first search (DFS) by default and can be configured to use breadth first search (BFS) instead. 
Tinkerpop has a long standing [issue](https://github.com/apache/tinkerpop/pull/838) that it claims to use DFS but actually uses BFS, and also cannot be configured to use one or the other. 

6. `.start` step only exists for `Node` and `NewNode`, not for other collections any more. Instead, use the standard Scala collection mechanism `.to(Traversal)`:

```java
// still works - nothing changed:
val someMethod = cpg.method.head
someMethod.start.parameter //Traversal[MethodParameterIn]

// using `.to(Traversal)` - standard Scala collection mechanism
val methodList: cpg.method.l
methodList.to(Traversal) //Traversal[Method]
```

7. `.clone` doesn't exist any more - note that Traversals typically have Iterator semantics, i.e. they are consumed during iteration:

```java
val source = cpg.identifier.name("foo")
val sink = cpg.call.name("bar")
sink.reachableByFlows(source).l  //contains flows (if any)
sink.reachableByFlows(source).l  //always empty - both source and sink Traversals have been consumed!
```

If you want to execute your traversals multiple times, simply define them as a function (`def`) rather than a value (`val`):

```java
def source = cpg.identifier.name("foo")
def sink = cpg.call.name("bar")
sink.reachableByFlows(source).l  //contains flows (if any)
sink.reachableByFlows(source).l  //same result: also contains flows (if any)
```

Please let us know if you need help with your migration, either by opening an issue or asking on [gitter](https://gitter.im/joern-code-analyzer/community).

### Bleeding edge / power users only:

8) If you used the underlying Tinkerpop API and OverflowDb types (e.g. via `.raw`), your scripts may be subject to additional changes, due to the removal of the Tinkerpop dependency and renames in OverflowDb types:
* `Steps` -> `Traversal`
* `NodeSteps` -> `Traversal`
* `NewNodeSteps` -> `Traversal`
* `OdbGraph` -> `Graph`
* `OdbNode` -> `NodeDb`
* `OdbEdge` -> `Edge`
* `id2` -> `id`
* `graph2` -> `graph`
* `addEdge2` -> `addEdge`
* `setProperty2` -> `setProperty`
* `NodeKeysOdb` -> `NodeKeys`
* all Tinkerpop types are gone: `Vertex`, `Edge`, `VertexProperty`, `ScalaGraph`, `GremlinScala`, ...
