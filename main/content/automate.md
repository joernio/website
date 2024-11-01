---
title: "Automatic Scans. On desktop, and in your CI."
layout: "blog"
url: "automate"
---


## Get Joern

{{< highlight html >}}
$ curl -L https://github.com/joernio/joern/releases/latest/download/joern-install.sh | sudo bash	
{{< /highlight >}}

## Run ```joern-scan```
{{< highlight html >}}
$ joern-scan ~/testcode

Detailed logs at: /tmp/joern-scan-log.txt
Result: 4.0 : Insecure functions strcpy() or strncpy() used: /home/suchakra/testcode/test.c:8:bad_vsprintf
Result: 4.0 : Insecure functions strcpy() or strncpy() used: /home/suchakra/testcode/test.c:24:bad_sprintf
Result: 4.0 : Insecure functions strcpy() or strncpy() used: /home/suchakra/testcode/test.c:44:bad_printf
...
{{< /highlight >}}

## So, what's under the hood?

```joern-scan``` runs multiple scanners for C/C++ that perform analysis of code complexity, buffer overflows, insecure usage of common functions etc. Each scanner is built upon queries that are bundled together. You can have a look at the C scanner [here](https://github.com/joernio/query-database/tree/main/src/main/scala/io/joern/scanners/c). Here is one scanner and how it works:

## Heap Based Buffer Overflow

One of the common cases of heap-based buffer overflows is condition when the size allocated during memory allocation operation is influenced by an arithetic operation - for example, ```malloc(y*2)```. This can lead to wrong memory allocated since the result of arithmetic operation involving a varible can cause the value to be actually zero or wrap-around. The issue actually becomes a heap-based overflow when eventually ```memcpy``` is used with its 3rd parameter (responsible for how much to copy) is not the exaxt same arithmetic expression used in ```malloc```. As we see, this is a targeted and more precise condition for buffer overflows. This has been modelled in Joern as follows:

1. Define the problem
Find calls to malloc where the first argument contains an arithmetic expression, the allocated buffer flows into memcpy as the first argument, and the third argument of that memcpy is unequal to the first argument of malloc.

2. Write a Joern Query
{{< highlight html >}}
 val src = cpg.call("malloc").where(_.argument(1).arithmetics)
  cpg
    .call("memcpy")
    .filter { call =>
      call
        .argument(1)
        .reachableBy(src)
        .not(_.argument(1).codeExact(call.argument(3).code))
        .hasNext
{{< /highlight >}}
The above query can be tested directly in the interactive Joern shell.

3. Create a Query Bundle for Scanner
To bundle up this query and add it to our C Scanner, we add some bells and whistles and create a executable method from it and then drop it in the scanner repo
{{< highlight html >}}
@q
  def mallocMemcpyIntOverflow()(implicit context: EngineContext): Query = Query(
    name = "malloc-memcpy-int-overflow",
    author = Crew.fabs,
    title = "Dangerous copy-operation into heap-allocated buffer",
    description = "-",
    score = 4, { cpg =>
      val src = cpg.call("malloc").where(_.argument(1).arithmetics)
      cpg
        .call("memcpy")
        .filter { call =>
          call
            .argument(1)
            .reachableBy(src)
            .not(_.argument(1).codeExact(call.argument(3).code))
            .hasNext
        }
    }
  )
{{< /highlight >}}

There are many such scanners for common as well as precise cases modelled as bundles of Joern queries. They all are part of the automated ```joern-scan```

