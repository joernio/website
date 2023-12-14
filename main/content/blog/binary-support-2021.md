---
title: "Joern Supports Binary"
date: 2021-07-08
author: "Niko Schmidt"
---

[Joern](https://joern.io/)'s frontend family is growing, and we welcome our newest member,
[Ghidra2cpg](https://github.com/joernio/ghidra2cpg/)! It makes Joern the first code querying tool
with binary support.

What can Ghidra2cpg do for you that other tools can't? Well, everything you are [used to doing with
Joern](https://docs.joern.io/) but with assembly.

For example, you can query function content: here you can see a comparison between ```objdump```
output on the left side and the Joern equivalent on the right side.

![image](/img/binary-support-2021/image-6.png)

One of the most interesting features of Joern is its data flow, which can be used with the new
frontend, too. Given the following C code, you are able to track the parameter of the function
`test_strcpy` to `strcpy` by defining a source and a sink.
```
void test_strcpy(char* x){
  char dest[4096];
  strcpy(dest,x);
}
```
![image](/img/binary-support-2021/image-7.png)

Ghidra2cpg uses Ghidra to disassemble code. It subsequently translates it into a code property graph
that can be queried using Joern. Choosing Ghidra as the basis for our analysis allows us to easily
adapt to the growing list of
[processors](https://github.com/NationalSecurityAgency/ghidra/tree/master/Ghidra/Processors) that
Ghidra already supports. However, the initial release includes support for x86 and x86_64 only. ARM,
MIPS as well as P-Code are in an early stage and will be released in the very near future.

We still want to give you a small preview of the ARM support:
![image](/img/binary-support-2021/image-1.png)

Enjoy!