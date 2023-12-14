---
title: "Hunt Bugs. On an Interactive Shell"
layout: "blog"
url: "query"

---


## Get Joern
{{< highlight html >}}
$ curl -L https://github.com/ShiftLeftSecurity/joern/releases/latest/download/joern-install.sh | sudo bash
{{< /highlight >}}

## Fire up Joern Shell 🔥
{{< highlight html >}}
  $ joern
    ...
    Compiling /home/suchakra/Projects/joernio/query-database/(console)                 

         ██╗ ██████╗ ███████╗██████╗ ███╗   ██╗
         ██║██╔═══██╗██╔════╝██╔══██╗████╗  ██║
         ██║██║   ██║█████╗  ██████╔╝██╔██╗ ██║
    ██   ██║██║   ██║██╔══╝  ██╔══██╗██║╚██╗██║
    ╚█████╔╝╚██████╔╝███████╗██║  ██║██║ ╚████║
     ╚════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝

    Type `help` or `browse(help)` to begin
	
    joern>
{{< /highlight >}}

## Import your code*

{{< highlight html >}}
  joern> importCode("/home/suchakra/testcode")
    Using generator for language: C
    Creating project `testcode` for code at `testcode`
    ...
    Code successfully imported. You can now query it using `cpg`.
    For an overview of all imported code, type `workspace`.
    res2: Option[Cpg] = Some(io.shiftleft.codepropertygraph.Cpg@36d4f8c1)                            
    
    joern> 
{{< /highlight >}}
*Don't have code? No worries, lets test with a file ```alloc_party.c``` stored in a directory ```testcode```

{{< highlight html >}}
/* alloc_party.c */ 

#include <stdio.h>                                                                                                 
#include <stdlib.h>

/*
 * So we have a situation where the malloc’s argument contains an arithmetic operation
 * This can lead to two cases:
 *  1. Zero Allocation (if the operation makes the argument 0 we get a NULL ptr)
 *  2. Overflow, if the computed allocation is smaller and we use memcpy() eventually
 */

void *alloc_havoc(int y) {
  int z = 10; 
  void *x = malloc(y * z); 
  return x;
}
{{< /highlight >}}

# Hunt Bugs


Lets try to find all ```malloc``` calls where the first argument contains an arithmetic expression. Its possible that even if one of the operands in the arithmetic operation are influenced by attacker, the resulting allocation could lead to a overflow or zero allocation 😬


## Write a Joern Query

{{< highlight html >}}
joern> cpg.call("malloc").where(_.argument(1).arithmetics).code.l 
    res7: List[String] = List("malloc(y * z)")                           
    
    joern> 
{{< /highlight >}}
<br>

Nice! We found the call site. We can now try to find where its located in code

{{< highlight html >}}
 joern>  cpg.call("malloc").where(_.argument(1).arithmetics).map { c => (c.file.name.l, c.location.lineNumber.l) }.l 
    res13: List[(List[String], List[Integer])] = List(
      (List("/home/suchakra/joern-workshop/alloc_party/alloc_party.c"), List(13))
    )

    joern> 
{{< /highlight >}}

For more queries, head over to https://queries.joern.io