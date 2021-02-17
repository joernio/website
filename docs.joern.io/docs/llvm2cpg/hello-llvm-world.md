---
id: hello-llvm
title: Hello, LLVM World
---

Besides working with the source code written in C and C++, Joern supports CPGs
generated from the [LLVM Bitcode](https://llvm.org/docs/BitCodeFormat.html).

This article shows a basic example of how to use [llvm2cpg](http://github.com/ShiftLeftSecurity/llvm2cpg) with Joern.

The basic workflow is the following:

1. Convert a program into LLVM Bitcode
2. Generate a CPG using llvm2cpg
3. Import the CPG into Joern and start the analysis

## Emit LLVM Bitcode

Let's start with a simple C program:

```c
// foo.c
int source(void);
void sink(int);
void foo() {
  int x = source();
  sink(x);
}
```

You can use the following command to convert `foo.c` to the bticode format:

```shell
$ clang -emit-llvm -S -g -O1 -o foo.ll foo.c 
```

Here is a brief explanation of what each flag does:

 - `-emit-llvm` tells clang to emit LLVM Bitcode instead of an object file or an executable
 - `-S` forces clang to emit the bitcode in a human-readable, textual format
 - `-g` enables debug info. Strictly speaking, this one is not needed, but it's essential if we want to map bitcode instructions back to the original source code
 - `-O1` by default, clang emits a very inefficient bitcode with a lot of redundancy. This flag tells clang to apply some optimizations to make the bitcode a bit more concise
 - `-o foo.ll` tells clang to store the result in the file `foo.ll`

Upon success, `foo.ll` should contain the following:

```bash
$ cat foo.ll
; ModuleID = 'foo.c'
source_filename = "foo.c"
target datalayout = "e-m:o-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-apple-macosx10.16.0"

; Function Attrs: noinline nounwind optnone ssp uwtable
define void @foo() #0 !dbg !8 {
  %1 = alloca i32, align 4
  call void @llvm.dbg.declare(metadata i32* %1, metadata !11, metadata !DIExpression()), !dbg !13
  %2 = call i32 @source(), !dbg !14
  store i32 %2, i32* %1, align 4, !dbg !13
  %3 = load i32, i32* %1, align 4, !dbg !15
  call void @sink(i32 %3), !dbg !16
  ret void, !dbg !17
}

; Function Attrs: nounwind readnone speculatable
declare void @llvm.dbg.declare(metadata, metadata, metadata) #1

declare i32 @source() #2

declare void @sink(i32) #2

<more lines truncated>
```

_Note:_ it's very likely that you have different `target datalayout` and `target triple` depending on the machine/OS you're running.

## Emit CPG

To convert LLVM Bitcode into CPG you need to get [llvm2cpg](https://github.com/ShiftLeftSecurity/llvm2cpg/releases/latest) and run the following command:

```bash
$ llvm2cpg --output=/tmp/foo.cpg.bin.zip foo.ll
[llvm2cpg] [info] More details: /tmp/llvm2cpg-6595f1.log
[llvm2cpg] [info] Loading foo.ll
[llvm2cpg] [info] Start type deduplication
[llvm2cpg] [info] Finish type deduplication
[llvm2cpg] [info] Emitting CPG 1/1
[llvm2cpg] [info] Serializing CPG
[llvm2cpg] [info] Saving CPG on disk
[llvm2cpg] [info] CPG is successfully saved on disk: /tmp/foo.cpg.bin.zip
[llvm2cpg] [info] Shutting down
```

Once done, the CPG (`/tmp/foo.cpg.bin.zip`) can be fed to Joern.

## Analyze CPG with Joern

Let's find the simple flow in the above program:

```bash
$ joern
joern> importCpg("/tmp/foo.cpg.bin.zip")
joern> run.ossdataflow
joern> def source = cpg.call("source")
joern> def sink = cpg.call("sink").argument
joern> sink.reachableByFlows(source).p
res26: List[String] = List(
  """____________________________________________________
| tracked               | lineNumber| method| file  |
|===================================================|
| source                | 5         | foo   | foo.c |
| <operator>.assignment | 5         | foo   | foo.c |
| sink                  | 6         | foo   | foo.c |
"""
)
```

Joern tells us that the result of the call to `source` (line 5) is passed to the function `sink` as an argument (line 6).
Looking at the original code it seems legit:

```c
// foo.c
int source(void);
void sink(int);
void foo() {
  int x = source();
  sink(x);
}
```

## Slightly more complex analysis

The previous example may seem too boring, so let's at something a bit more interesting now.
Consider the following program with a double free bug:

```c
// main.c
#include <stdlib.h>

extern void use_buffer(void *b);

int main(int argc, char **argv) {
  void *buf = malloc(42);
  if (argc & 1) {
    use_buffer(buf);
    free(buf);
  }
  free(buf);
  return 0;
}
```

Following the same steps, we get a CPG:

```bash
$ clang -emit-llvm -S -g -O1 -o main.ll main.c
$ llvm2cpg --output=/tmp/main.cpg.bin.zip main.ll
```

And start the analysis. Here we are interested to see if any value passed as an argument to the `free` function is passed as an argument to the function `free`.
By default, we get three flows as follows:

```bash
$ joern
joern> workspace.reset
joern> importCpg("/tmp/main.cpg.bin.zip")
joern> run.ossdataflow
joern> def source = cpg.call("free").argument
joern> def sink = cpg.call("free").argument
joern> sink.reachableByFlows(source).p
res54: List[String] = List(
  """______________________________________
| tracked| lineNumber| method| file   |
|=====================================|
| free   | 12        | main  | main.c |
""",
  """______________________________________
| tracked| lineNumber| method| file   |
|=====================================|
| free   | 10        | main  | main.c |
""",
  """______________________________________
| tracked| lineNumber| method| file   |
|=====================================|
| free   | 10        | main  | main.c |
| free   | 12        | main  | main.c |
"""
)
```

The first two are 'loops': there is a flow from the `free` to itself.
We can filter these results out by only asking for flows that are longer than one:

```bash
joern> sink.reachableByFlows(source).filter(f => f.elements.size > 1).p
res55: List[String] = List(
  """______________________________________
| tracked| lineNumber| method| file   |
|=====================================|
| free   | 10        | main  | main.c |
| free   | 12        | main  | main.c |
"""
)
```

Which yields the double-free bug in the program!

