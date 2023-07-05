---
id: control-flow-steps
title: Control-Flow Steps
---

Control-Flow Steps are Complex Steps that represent control-flow graph traversals.

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

### controls

`controls` is a _Control-Flow Step_ that determines all nodes which the preceding node controls.

```java
joern> cpg.call.code(".*argc.*strcmp.*").controls.code.l
res0: List[String] = List(
  "fprintf(stderr, \"It depends!\\n\")",
  "stderr",
  "\"It depends!\\n\"",
  "exit(42)",
  "42"
)
```

### controlledBy

`controlledBy` is a _Control-Flow Step_ that determines recursively all nodes on which the preceding node is control-dependent. 

```java
joern> cpg.call.codeExact("exit(42)").controlledBy.code.l
res0: List[String] = List("argc > 1 && strcmp(argv[1], \"42\") == 0")
```

### dominates

`dominates` is a _Control-Flow Step_ which determines all nodes that are dominated by this node.

```java
joern> cpg.call.code(".*argc.*strcmp.*").dominates.code.l
res0: List[String] = List(
  "RET",
  "exit(0)",
  "0",
  "printf(\"What is the meaning of life?\\n\")",
  "exit(42)",
  "42",
  "fprintf(stderr, \"It depends!\\n\")",
  "\"It depends!\\n\"",
  "stderr",
  "\"What is the meaning of life?\\n\""
)
```

### dominatedBy

`dominatedBy`  is a _Control-Flow Step_ which determines all nodes by which the node is dominated.

```java
joern> cpg.call.codeExact("exit(42)").dominatedBy.code.l
res0: List[String] = List(
  "main (int argc,char *argv[])",
  "argc",
  "1",
  "argc > 1",
  "argc > 1 && strcmp(argv[1], \"42\") == 0",
  "stderr",
  "\"It depends!\\n\"",
  "fprintf(stderr, \"It depends!\\n\")",
  "42"
)
```

### postDominates

`postDominates`  is a _Control-Flow Step_ that determines all nodes that are post-dominated by this node.

```java
joern> cpg.call.code(".*argc.*strcmp.*").postDominates.code.l
res0: List[String] = List(
  "argv",
  "1",
  "argv[1]",
  "\"42\"",
  "strcmp(argv[1], \"42\")",
  "0",
  "main (int argc,char *argv[])",
  "argc",
  "1",
  "argc > 1",
  "strcmp(argv[1], \"42\") == 0"
)
```


### postDominatedBy

`postDominatedBy`  is a _Control-Flow Step_ that determines all nodes by which the node is post dominated.

```java
joern> cpg.call.codeExact("exit(42)").postDominatedBy.code.l
res0: List[String] = List(
  "RET",
  "exit(0)",
  "0",
  "printf(\"What is the meaning of life?\\n\")",
  "\"What is the meaning of life?\\n\""
)
```

