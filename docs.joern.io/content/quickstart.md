---
id: quickstart
title: Quickstart
weight: 25
---

Joern is a command-line tool for static code analysis. Joern can
help you find and correct security vulnerabilities in programs with
hundreds of thousands of lines of code, including flaws that are
difficult to detect with fuzzing. It includes an interactive shell and
automation capabilities centered around Code Property Graphs.

This article introduces you to the basics of working with Joern. You
learn how to create and modify Code Property Graphs, how to query them
and about organisational commands. If you have not yet installed
Joern, you can do so by following [these instructions](/installation).

## Obtaining the Sample Program

Before you start Joern, you should have a program ready to
analyze. Clone the following git repository which contains a simple
program named `X42`:

```bash
git clone https://github.com/ShiftLeftSecurity/x42.git
```

Let us start with a problem statement. Show - without running the
program - that an input exists for which `X42` writes a string to
standard error (STDERR).

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


## Starting Joern's Interactive Shell

Launch Joern in your shell:
```shell
$ joern
```

A console session will start and you will see a prompt:
```java
joern>
```

The prompt you are looking at is the prompt of a Scala-based REPL. If
you have no experience with Scala or read-eval-print-loops, don't
worry, you can accomplish a lot with Joern by focusing only on what
its commands allow you to do. If you _are_ familiar with Scala and
REPLs, you may be pleasantly surprised at the flexibility it provides
you with.

## Importing the Code

We create a Code Property Graph for the `X42` program using the
command `importCode`, which requires the path to the source code to be
passed as a first argument, and a project name as a second
argument. In particular, `importCode` creates a new project directory
and stores a binary representation of the Code Property Graph in it.

```java
joern> importCode(inputPath="./x42/c", projectName="x42-c")
Creating project `x42-c` for code at `x42/c`
... output omitted
res1: Option[Cpg] = Some(io.shiftleft.codepropertygraph.Cpg@31ed46c5)
```

{{< hint info >}}
If you see an error and a return value of `None`, you have probably pointed Joern to the wrong input path for the directory containing the source code for the sample project.
{{< /hint >}}

## Querying the Code Property Graph

You are ready to analyze your first program using Joern and the Code
Property Graph. Code analysis in Joern is done using the CPG query
language, a domain-specific language designed specifically to work
with the Code Property Graph. It contains practical representations of
the various nodes found in the Code Property Graph, and useful
functions for querying their properties and relationships between each
other. The top-level entry point into a Code Property Graph loaded in
memory, and the root object of the query Language is `cpg`. If you
evaluate `cpg` at the prompt, the output is underwhelming:

```java
joern> cpg
res2: Cpg = io.shiftleft.codepropertygraph.Cpg@cb0d5241
```

Rest assured, a lot is hidden behind that simple statement. You will
discover the full set of commands in time, but for now, you should
learn a helpful Joern trick: `TAB`-completion. In the Joern prompt,
type `cpg.`, do not press `ENTER`, but instead press `TAB`. You will
see a list of available functions `cpg` supports:
```java
joern> cpg.
all                comment            goto               literal            namespace          tryBlock
argument           continue           graph              local              namespaceBlock     typ
arithmetic         controlStructure   help               member             parameter          typeDecl
assignment         doBlock            id                 metaData           ret                typeRef
break              elseBlock          identifier         method             runScript          whileBlock
call               file               ifBlock            methodRef          switchBlock
close              forBlock           jumpTarget         methodReturn       tag
```

TAB-completion is available for all query language directives, and for
top-level commands. For more descriptive assistance, use the `help`
command, like so:
```java
joern> help.cpg 
res3: String = """
Upon importing code, a project is created that holds an intermediate
representation called `Code Property Graph`. This graph is a composition of
low-level program representations such as abstract syntax trees and control flow
graphs, but it can be arbitrarily extended to hold any information relevant in
your audit, information about HTTP entry points, IO routines, information flows,
or locations of vulnerable code. Think of Joern as a CPG editor.

In practice, `cpg` is the root object of the query language, that is, all query
language constructs can be invoked starting from `cpg`. For exanple,
`cpg.method.l` lists all methods, while `cpg.finding.l` lists all findings of
potentially vulnerable code."""
```

## Solving the Challenge

Now that we have a good set of basic commands, and a Code Property
Graph loaded in memory, let us return to our `X42` program and the
problem we want to solve using Joern.
To reiterate, the problem statement is _Show that an input exists for
which the X42 program always writes a string to STDERR_. And this is
the `X42` program:

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

There are two parts in the problem statement: 1. _does the program
write anything to STDERR?_, and 2. _if there is a call writing to
STDERR, is it conditional on a value passed in as argument to the
`X42` program?

Joern makes answering both questions easy. To answer the first one,
whether the program writes anything to STDERR, we can search for nodes
of type `CALL` in the graph, then use the `argument` step to only
select those calls which have connections to nodes of type `ARGUMENT`,
followed by the `code("stderr")` property filter step which selects only
those nodes that have the string `stderr` as the value of their `CODE`
property. We find exactly one:

```java
joern> cpg.call.argument.code("stderr").toList
res3: List[Expression] = List(
  Identifier(
    id -> 1000118L,
    argumentIndex -> 1,
    argumentName -> None,
    code -> "stderr",
    columnNumber -> Some(value = 12),
    lineNumber -> Some(value = 7),
    name -> "stderr",
    order -> 1,
    typeFullName -> "ANY"
  )
)
```
This query shows that `stderr` is used somewhere in the program, but doesn't give us any more information. Using the query from the previous step, we can use the `astParent` construct to find out more about the surroundings of the `stderr` usage by moving up the hierarchy of the abstract syntax tree that is part of the Code Property Graph. Moving up one level in the AST hierarchy gives us an `fprintf` call:

```java
joern> cpg.call.argument.code("stderr").astParent.toList
res4: List[AstNode] = List(
  Call(
    id -> 1000117L,
    argumentIndex -> 1,
    argumentName -> None,
    code -> "fprintf(stderr, \"It depends!\\n\")",
    columnNumber -> Some(value = 4),
    dispatchType -> "STATIC_DISPATCH",
    lineNumber -> Some(value = 7),
    methodFullName -> "fprintf",
    name -> "fprintf",
    order -> 1,
    signature -> "TODO",
    typeFullName -> "<empty>"
  )
)
```

With this query we have proven the first part of our problem statement correct, there is a place in the `X42` program that writes to STDERR. Let us move to the second part, the check whether the call that writes something to STDERR is conditional on a value passed as input to the `X42` program. Since we are analyzing a program written in `C`, we will search the Code Property Graph for the conventional `argc` or `argv` parameters of the `main` function as the input that potentially triggers the call which writes to STDERR.

As before, we can use the `astParent` to move up the AST. Moving up another level in the AST hierarchy gives us a block; not very helpful:

```java
joern> cpg.call.argument.code("stderr").astParent.astParent.toList
res5: List[AstNode] = List(
  Block(
    id -> 1000116L,
    argumentIndex -> 2,
    argumentName -> None,
    code -> "",
    columnNumber -> Some(value = 46),
    lineNumber -> Some(value = 6),
    order -> 2,
    typeFullName -> "void"
  )
)
```

Another layer up gives us an if statement, much better:

```java
joern> cpg.call.argument.code("stderr").astParent.astParent.astParent.toList
res6: List[AstNode] = List(
  ControlStructure(
    id -> 1000104L,
    argumentIndex -> 1,
    argumentName -> None,
    code -> "if (argc > 1 && strcmp(argv[1], \"42\") == 0)",
    columnNumber -> Some(value = 2),
    controlStructureType -> "IF",
    lineNumber -> Some(value = 6),
    order -> 1,
    parserTypeName -> "IfStatement"
  )
)
```

The `CODE` property of the `CONTROL_STRUCTURE` node you just found proves the second part of our problem statement correct, the call that writes to STDERR is conditional on `argc` and `argv`. Hence, the whole problem statement is correct.

## Closing the Project

Now that we've finished the analysis, let us close the project, which also unloads the Code Property Graph from memory. You do not have to worry about losing any data, because it will remain on disk in the `x42-c` project you created earlier with `importCode`. Close the project using the aptly-named `close`:

```java
joern> close 
2020-05-08 01:13:01.752 WARN clearing 105 references - this may take some time
2020-05-08 01:13:01.756 WARN cleared all clearable references
res7: Option[io.shiftleft.console.workspacehandling.Project] = Some(
  Project(
    ProjectFile("/home/user/x42/c", "x42-c"),
    /home/user/.shiftleft/joern/workspace/x42-c,
    None
  )
)
```

As a final step, exit Joern:

```java
joern> :exit
```

Congratulations, you have successfully queried your first  Code
Property Graph using Joern and its query language. More examples can be found on the
[query-database website](http://queries.joern.io) (also see [Joern Scan](scan.md)).

In subsequent articles, you will learn the more advanced features of Joern and also
how to use it to find your first real-world vulnerability.
