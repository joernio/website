---
id: repeat-steps
title: Repeat Steps
---

Repeat Steps are CPGQL Steps which repeat another traversal multiple times.

### repeat..maxDepth

```java
joern> cpg.method.name("main").repeat(_.astChildren)(_.maxDepth(4)).l
res0: List[AstNode] = List(
  Call(
    id -> 13L,
    code -> "argc > 1",
    name -> "<operator>.greaterThan",
// ...output trimmed for brevity
  ),
  Call(
    id -> 16L,
    code -> "strcmp(argv[1], \"42\") == 0",
    name -> "<operator>.equals",
// ...output trimmed for brevity
  ),
  Call(
    id -> 24L,
    code -> "fprintf(stderr, \"It depends!\\n\")",
    name -> "fprintf",
// ...output trimmed for brevity
  ),
  Call(
    id -> 27L,
    code -> "exit(42)",
    name -> "exit",
// ...output trimmed for brevity
  )
)
```

### repeat..until

```java
joern> cpg.method.name("main").repeat(_.astChildren)(_.until(_.isCall)).l
res0: List[AstNode] = List(
  Call(
    id -> 29L,
    code -> "printf(\"What is the meaning of life?\\n\")",
    name -> "printf",
// ...output trimmed for brevity
  ),
  Call(
    id -> 31L,
    code -> "exit(0)",
    name -> "exit",
// ...output trimmed for brevity
  ),
  Call(
    id -> 12L,
    code -> "argc > 1 && strcmp(argv[1], \"42\") == 0",
    name -> "<operator>.logicalAnd",
// ...output trimmed for brevity
  ),
  Call(
    id -> 24L,
    code -> "fprintf(stderr, \"It depends!\\n\")",
    name -> "fprintf",
// ...output trimmed for brevity
  ),
  Call(
    id -> 27L,
    code -> "exit(42)",
    name -> "exit",
// ...output trimmed for brevity
  )
)
```

```java
joern> cpg.method.name("main").repeat(_.astChildren)(_.until(_.isCall.name("exit"))).l 
res0: List[AstNode] = List(
  Call(
    id -> 31L,
    code -> "exit(0)",
    name -> "exit",
// ...output trimmed for brevity
  ),
  Call(
    id -> 27L,
    code -> "exit(42)",
    name -> "exit",
// ...output trimmed for brevity
  )
)
```

### repeat..emit..maxDepth


```java
joern> cpg.method.name("main").repeat(_.astChildren)(_.emit(_.isControlStructure).maxDepth(4)).l
res0: List[AstNode] = List(
  ControlStructure(
    id -> 11L,
    code -> "if (argc > 1 && strcmp(argv[1], \"42\") == 0)",
// ...output trimmed for brevity
  ),
  Call(
    id -> 13L,
    code -> "argc > 1",
    name -> "<operator>.greaterThan",
// ...output trimmed for brevity
  ),
  Call(
    id -> 16L,
    code -> "strcmp(argv[1], \"42\") == 0",
    name -> "<operator>.equals",
// ...output trimmed for brevity
  ),
  Call(
    id -> 24L,
    code -> "fprintf(stderr, \"It depends!\\n\")",
    name -> "fprintf",
// ...output trimmed for brevity
  ),
  Call(
    id -> 27L,
    code -> "exit(42)",
    name -> "exit",
// ...output trimmed for brevity
  )
)
```

### repeat..emit..until

```java
joern> cpg.method.name("main").repeat(_.astChildren)(_.emit(_.isControlStructure).until(_.isCall)).l
res0: List[AstNode] = List(
  ControlStructure(
    id -> 1000105L,
    code -> "if (argc > 1 && strcmp(argv[1], \"42\") == 0)",
    // ... output omitted
  ),
  Call(
    id -> 1000106L,
    code -> "argc > 1 && strcmp(argv[1], \"42\") == 0",
    name -> "<operator>.logicalAnd",
    // ... output omitted
  ),
  Call(
    id -> 1000118L,
    code -> "fprintf(stderr, \"It depends!\\n\")",
    name -> "fprintf",
    // ... output omitted
  ),
  Call(
    id -> 1000121L,
    code -> "exit(42)",
    name -> "exit",
    // ... output omitted
  ),
  Call(
    id -> 1000123L,
    code -> "printf(\"What is the meaning of life?\\n\")",
    name -> "printf",
    // ... output omitted
  ),
  Call(
    id -> 1000125L,
    code -> "exit(0)",
    name -> "exit",
    // ... output omitted
  )
)
```
