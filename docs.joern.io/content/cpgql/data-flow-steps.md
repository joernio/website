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

