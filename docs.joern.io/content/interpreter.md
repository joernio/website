---
id: interpreter
title: Interpreter
weight: 80
---

The Joern shell can be used as a script interpreter, that is, in non-interactive mode.


## Basic Usage

Joern can be used in non-interactive mode. You would execute commands and operations via a script that you specify as an argument instead of manually typing them after the Joern prompt. Joern runs the commands in your script and exits when done.

For example, let's say you have a file named `test.sc` with the following contents:

```java
@main def exec(cpgFile: String, outFile: String) = {
   importCpg(cpgFile)
   cpg.method.name #> outFile
}
```

You can include Scala code in `test.sc` and use the `|#` operator to pipe output into files. The script is then run as follows:
```bash
./joern --script test.sc --param cpgFile=/src.path.zip --param outFile=output.log
```

## Importing Additional Scripts

If your script depends on code from one or more additional scripts, you can use the `--import` parameter, which accepts a comma-separated list of input scripts:

```bash
./joern --script test.sc --param cpgFile=/src.path.zip --param outFile=output.log --import scripts/hello.sc
```
