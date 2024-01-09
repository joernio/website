---
id: complex-steps
title: Complex Steps
---

Complex Steps are CPGQL Steps which combine the functionality of one or more Node-Type Steps, Repeat Steps, Filter Steps, Core Steps or Execution Directives. They are represented by one or more Directives and can be of three types: _Generic Complex Steps_, _Call Graph Steps_ or _Dataflow Complex Steps_.


## Generic Complex Steps

### dump

`dump` is a _Complex Step_ which executes the traversal and returns the value of the CODE property of the nodes it suffixes with syntax-highlighting.

```java
joern> cpg.method.name("main").dump
res0: List[String] = List(
  """int main(int argc, char *argv[]) { /* <=== */
  if (argc > 1 && strcmp(argv[1], "42") == 0) {
    fprintf(stderr, "It depends!\n");
    exit(42);
  }
  printf("What is the meaning of life?\n");
  exit(0);
}"""
)
```

### dumpRaw


`dumpRaw` is a _Complex Step_ which executes the traversal and returns the value of the CODE property of the nodes it suffixes.

```java
joern> cpg.method.name("main").dumpRaw
res0: List[String] = List(
  """int main(int argc, char *argv[]) { /* <=== */
  if (argc > 1 && strcmp(argv[1], "42") == 0) {
    fprintf(stderr, "It depends!\n");
    exit(42);
  }
  printf("What is the meaning of life?\n");
  exit(0);
}"""
)
```

### tagList


`tagList` is a _Complex Step_ which executes the traversal and returns the list of all TAG nodes found at each node visited by the traversal it suffixes.

```java
joern> cpg.method.tagList 
res0: List[List[TagBase]] = List(List(NewTag("MY_TAG", "")))
```

## Call Graph Steps

_Call Graph Steps_ are _Complex Steps_ which traverse the nodes of a _Code Property Graph_ which represent a program's Call Graph.

The following examples are run on the simple program named `X42`:

```java
public class X42 {
  public static void main(String[] args) {
    if (args.length > 0 && args[0].equals("42")) {
      System.err.println("It depends!");
      System.exit(42);
    }
    System.out.println("What is the meaning of life?");
    System.exit(0);
  }
}
```

### callee

`callee` is a _Call Graph Step_ which lists all nodes representing Call Graph callees of the traversed nodes.

```java
joern> cpg.method.name("main").callee.name.l 
res0: List[String] = List(
  "printf",
  "exit",
  "exit",
  "<operator>.logicalAnd",
  "<operator>.greaterThan",
  "<operator>.equals",
  "fprintf",
  "strcmp",
  "<operator>.indirectIndexAccess"
)
```

### caller

`caller` is a _Call Graph Step_ which lists all nodes representing Call Graph callers of the traversed nodes.

```java
joern> cpg.method.name("exit").caller.code.l 
res0: List[String] = List("main (int argc,char *argv[])", "main (int argc,char *argv[])")
```

### callIn

`callIn` is a _Call Graph Step_ which lists all nodes representing Call Graph parent call-sites of the traversed nodes.

```java
joern> cpg.method.name("exit").callIn.code.l 
res0: List[String] = List("exit(0)", "exit(42)")
```

### inCall

`inCall` is a _Call Graph Step_ which lists all nodes representing surrounding Call Graph call-sites of the traversed nodes.

```java
joern> cpg.call.name("<operator>.indirectIndexAccess").inCall.code.l 
res0: List[String] = List("strcmp(argv[1], \"42\")")
```

## Dataflow Steps

_Dataflow Steps_ are _Complex Steps_ which traverse the nodes of a _Code Property Graph_ which represent a program's data-flow. `controlledBy`, `flows`, `source`, `sink`, `reachableBy` are all CPGQL Components that are combined to construct _Dataflow Steps_.

