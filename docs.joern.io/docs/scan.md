---
id: scan
title: Joern Scan
---

This article is a brief introduction to _Joern Scan_, a code scanner built on top of
Joern. _Joern Scan_ helps you detect security issues inside programs and can
help guide your vulnerability discovery and variant analysis processes. Whether
you're looking for the usage of insecure functions like _strcpy_, instances of
_use-after-free_, or are trying to find methods with a high number of
conditionals for a closer inspection, this tool is for you.

Let's start by looking at a simple example. To follow along, install _Joern_ by
[following these instructions](installation), it comes pre-packaged with _Joern Scan_.

Given the following simple program written in C:

```c
// simple.c
#include <stdio.h>

int main () {
   char str[50];
   printf("Enter a string : ");
   gets(str);
   printf("You entered: %s", str);
   return(0);
}
```

You can run _Joern Scan_ by providing the filepath as input:

```
$ joern-scan simple.c
Detailed logs at: /tmp/joern-scan-log.txt
Result: 8.0 : Dangerous function gets() used: /home/user/code/simple.c:6:main
```

Behind the scenes of this invocation, three things happen:

1. The Code Property Graph for `simple.c` is generated
2. A set of pre-defined queries are executed against the Code Property Graph
   representation of `simple.c`
3. Finally, the results are printed to stdout

The results are the most visible bit. They follow the format:

```
Result: $QUERY_SCORE : $QUERY_TITLE: $FILEPATH:$LINE_NUMBER:$FUNCTION_NAME
```
Results tell you if a _Query_ matched, and where.

The _Queries_ are the most important bit. At a minimum, they have a unique name,
a score, a description, and a traversal. This is an example of how a query is defined:

```java
  def getsUsed(): Query =
    Query.make(
      name = "call-to-gets",
      author = Crew.suchakra,
      title = "Dangerous function gets() used",
      description =
        """
        | Avoid `gets` function as it can lead to reads beyond buffer
        | boundary and cause
        | buffer overflows. Some secure alternatives are `fgets` and `gets_s`.
        |""".stripMargin,
      score = 8,
      withStrRep({ cpg =>
        cpg.method("gets").callIn
      }),
      tags = List(QueryTags.badfn)
    )
```

_cpg.method("gets").callIn_ is the graph traversal of the _Query_. It is wrapped
in the `withStrRep` function for functional purposes, namely to generate a
string representation of it for display.

_Joern Scan_ ships with a default set of queries, the _Joern Query Database_.
This set of queries is constantly updated, and contributions are highly encouraged
https://github.com/joernio/query-database.


You can fetch the latest version of the _Joern Query Database_ using the _--updatedb_ flag:

```bash
$ joern-scan --updatedb
Downloading default query bundle from: https://github.com/joernio/query-database/releases/download/v0.0.68/querydb.zip
Wrote: 10785252 bytes to /tmp/joern-scan4746805711015614603/querydb.zip
Removing current version of query database
Schema directory at /home/claudiu/code/joern/schema-extender/schemas does not exist
Adding updated version of query database
Schema directory at /home/claudiu/code/joern/schema-extender/schemas does not exist
```

All queries will be tested against a program under analysis, but you can
also selectively choose which ones to run.

You can specify a set of tags, for example:

```bash
$ joern-scan simple.c --only-tags badfn
Detailed logs at: /tmp/joern-scan-log.txt
Result: 8.0 : Dangerous function gets() used: /home/user/code/simple.c:6:main
```

Or a set of query names:

```bash
$ joern-scan simple.c --only-names call-to-gets,multiple-returns
Detailed logs at: /tmp/joern-scan-log.txt
Result: 8.0 : Dangerous function gets() used: /home/user/code/simple.c:6:main
```

One other CLI argument you will find useful is _--overwrite_. _--overwrite_
forces _Joern Scan_ to regenerate a Code Property Graph for the program under
analysis. You will want to use this flag whenever significant changes are introduced
into a program which you've scanned before. Keep in mind that regenerating
Code Property Graphs for large codebases will take some time.

```bash
$ joern-scan simple.c --overwrite
Detailed logs at: /tmp/joern-scan-log.txt
Result: 8.0 : Dangerous function gets() used: /home/user/code/simple.c:6:main
```

That concludes everything you need to know about how to use _Joern Scan_. Happy
hunting!
