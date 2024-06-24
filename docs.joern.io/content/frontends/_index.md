---
id: frontends 
title: Frontends
bookCollapseSection: true
weight: 135
---

## Frontends

Joern contains multiple frontends, each responsible for parsing the source code and generating the AST for their respective languages. `X2CPG` is the base on which all of the other frontends are built, and contains common structures by all of the languages. Each frontend contains the base arguments from `x2cpg`, as well as custom arguments that is frontend specific. See each respective language's page for a detailed explanation on what arguments are available and what the arguments do.

## Invoking a frontend
Parsing code and generating the respective AST is done using the `joern-parse` command. The following is an example on how to use `joern-parse`:
```bash
./joern-parse /path/to/input/dir --output "outputFile" --language JAVA
```

The `language` argument specifies which frontend should be used when parsing the source code. The following is a list of available frontends and the languages they are responsible for:
| **Frontend** | **Language Arg** |
| - | - |
| `c2cpg` | `--language C` |
| `csharp2cpg` | `--language CSHARP` |
| `ghidra2cpg` | `--language GHIDRA` |
| `gosrc2cpg` | `--language GOLANG` |
| `javasrc2cpg` | `--language JAVASRC` |
| `jimple2cpg` | `--language JAVA` |
| `jssrc2cpg` | `--language JAVASCRIPT` |
| `kotlin2cpg` | `--language KOTLIN` |
| `php2cpg` | `--language PHP` |
| `pysrc2cpg` | `--language PYTHONSRC` |
| `rubysrc2cpg` | `--language RUBYSRC` |
| `swiftsrc2cpg` | `--language SWIFTSRC` |