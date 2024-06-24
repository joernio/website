---
id: frontends 
title: Frontends
bookCollapseSection: true
weight: 135
---

## Frontends

Joern contains multiple frontends, each responsible for parsing the source code and generating the AST for their respective languages. `X2CPG` is the base on which all of the other frontends are built, and contains common structures by all of the languages. Each frontend contains the base arguments from `x2cpg`, as well as custom arguments that is frontend specific. See each respective languages' page for a detailed explanation on what arguments are available and what each of the arguments do.

## Invoking a specific frontend
To generate the AST for source files with a specific frontend you will need to find the frontend in the `joern-cli/frontends/` folder. Once there, you will need to build the frontend using `sbt` afterwhich you can invoke it direclty with the script that is generated. As an example, to parse a given Python directory and generate an AST:
```bash
cd joern-cli/frontends/pysrc2cpg/
sbt scala stage
./pysrc2cpg /some/input/path --output someOutput --venvDir /some/venv/dir
```
The arguments given after the `pysrc2cpg` command can be a mixture of the args found in `x2cpg`, as well as the language specific args for Python.

If you would like to generate the full `CPG` for a given source directory, you can do so using the `joern-parse` command:
```bash
./joern-parse /some/input/path --language JAVASRC
```
The language argument selects the frontend used to generate the AST. If this argument is omitted, `joern-parse` will select a frontend based on the supported file type with the largest number of files in the given input directory.

Below is a list of each of the different frontends and the languages that they support:
| **Frontend** | **Language** | **Language Arg** |
| - | - | - |
| `c2cpg` | `C` | `--language C` |
| `csharp2cpg` | `C#` | `--language CSHARPSRC` |
| `ghidra2cpg` | `Ghidra` | `--language GHIDRA` |
| `gosrc2cpg` | `Golang` | `--language GOLANG` |
| `javasrc2cpg` | `Java` | `--language JAVASRC` |
| `jimple2cpg` | `Java` | `--language JAVA` |
| `jssrc2cpg` | `Javascript` | `--language JAVASCRIPT` |
| `kotlin2cpg` | `Kotlin` | `--language KOTLIN` |
| `php2cpg` | `PHP` | `--language PHP` |
| `pysrc2cpg` | `Python` | `--language PYTHONSRC` |
| `rubysrc2cpg` | `Ruby` | `--language RUBYSRC` | 
| `swiftsrc2cpg` | `Swift` | `--language SWIFTSRC` |
