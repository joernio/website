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

The script may contain arbitrary Scala code as well as Joern directives (e.g. `importCpg`). The `#>` operator can be used to pipe output into files, similar to `>` in a unix shell. 
You can run the script as follows:
```bash
./joern --script test.sc --param cpgFile=src.path.zip --param outFile=output.log
```

## Importing additional scripts

If your script depends on code from one or more additional scripts, you can use the `--import` parameter (may be used multiple times). The given source files are compiled and added to the classpath, but they are _not_ executed. If you want to do that, read on.

```bash
./joern --script test.sc --param cpgFile=src.path.zip --param outFile=output.log --import scripts/hello.sc
```

## Executing code on startup

`--runBefore` can be passed multiple times - note that it doesn't take a file as input, but individual statements:

```bash
./joern --script test.sc --param cpgFile=src.path.zip --param outFile=output.log --runBefore 'val bar = 41' --runBefore 'val foo = bar'
```
