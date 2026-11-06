---
id: data-flow-steps
title: Data-Flow Steps
---

Data-Flow Steps are Complex Steps that represent flows of data.

We will look at each one using our sample program `X42`:

```c
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

### reachableBy

`reachableBy` is a _Data-Flow Step_ that returns sources for flows of data from sinks to sources.

```java

joern> def source = cpg.method.name("main").parameter
joern> def sink = cpg.call.name("strcmp").argument
joern> sink.reachableBy(source).l
val res4: List[io.shiftleft.codepropertygraph.generated.nodes.MethodParameterIn] = List(
  MethodParameterIn(
    id = 15L,
    closureBindingId = None,
    code = "char *argv[]",
    columnNumber = Some(value = 20),
    dynamicTypeHintFullName = ArraySeq(),
    evaluationStrategy = "BY_VALUE",
    index = 2,
    isVariadic = false,
    lineNumber = Some(value = 6),
    name = "argv",
    order = 2,
    possibleTypes = ArraySeq(),
    typeFullName = "char[]*"
  )
)
```

### reachableByFlows

`reachableByFlows` is a _Data-Flow Step_ that returns paths for flows of data from sinks to sources. 

```java
joern> def source = cpg.method.name("main").parameter
joern> def sink = cpg.call.name("strcmp").argument
joern> sink.reachableByFlows(source).p
val res0: List[String] = List(
  """
┌─────────────────┬────────────────────────────┬──────────┬──────┬─────┐
│nodeType         │tracked                     │lineNumber│method│file │
├─────────────────┼────────────────────────────┼──────────┼──────┼─────┤
│MethodParameterIn│main(int argc, char *argv[])│5         │main  │X42.c│
│Call             │strcmp(argv[1], "42")       │6         │main  │X42.c│
└─────────────────┴────────────────────────────┴──────────┴──────┴─────┘
  """)
```


### Interprocedural depth

The data-flow engine follows calls only up to a fixed depth. With the
default `EngineContext()`, it enters at most 4 calls along a flow
(`EngineConfig.maxCallDepth`, "the k-limit for calls and field accesses").
A flow that needs more is not reported, and no message says it was cut off.
For example, the flow from `source` to `sink` below is found with up to four
nested helpers like `p1` and is missed with five:

```java
static String p1(String s) { return p2(s); }
static String p2(String s) { return p3(s); }
// ... p3 to p5 continue the same way, and p5 returns s
sink(p1(source));
```

You can raise the depth by passing your own configuration. A value of `-1`
removes the limit.

```java
joern> import io.joern.dataflowengineoss.queryengine.{EngineConfig, EngineContext}
joern> implicit val context: EngineContext = EngineContext(config = EngineConfig(maxCallDepth = 10))
joern> sink.reachableByFlows(source).p
```

A higher depth finds longer flows but makes queries slower. The command-line
tools have their own defaults: `joern-flow --depth` defaults to 1, and
`joern-scan --depth` defaults to 2.
