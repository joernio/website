---
title: Installation
id: installation
weight: 20
---

## Prerequisites

* JDK 19 (get here for example: https://openjdk.java.net/install/); newer JDK versions _might_ work, but have not been properly tested

## Installing Pre-Built Binaries

Pre-built binaries of the joern-cli are available at:

https://github.com/joernio/joern/releases/

To install the latest release, simply execute the following

```bash
mkdir joern && cd joern # optional
curl -L "https://github.com/joernio/joern/releases/latest/download/joern-install.sh" -o joern-install.sh
chmod u+x joern-install.sh
./joern-install.sh --interactive
```

and follow the installer instructions.
By default, joern will be installed at `~/bin/joern`.

You can test your installation as follows:

```bash
cd <path_to_joern>/joern/joern-cli
./joern

     ██╗ ██████╗ ███████╗██████╗ ███╗   ██╗
     ██║██╔═══██╗██╔════╝██╔══██╗████╗  ██║
     ██║██║   ██║█████╗  ██████╔╝██╔██╗ ██║
██   ██║██║   ██║██╔══╝  ██╔══██╗██║╚██╗██║
╚█████╔╝╚██████╔╝███████╗██║  ██║██║ ╚████║
 ╚════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝
Version: 2.0.42
Type `help` to begin

joern>
```

## Building from Source Code

To build joern-cli from source code, you need to
install the Scala build tool (sbt), which you can install by following
the instructions at https://www.scala-sbt.org/download.html. Any 1.x
version of sbt works as sbt downloads the correct version for building
joern as part of the build process.

If you are building Joern using macOS you will need to install the
greadlink package:

```bash
brew install coreutils
```

Once the dependencies are installed, run

```bash
git clone https://github.com/joernio/joern.git
cd joern
sbt stage
```

This builds joern-cli in the current directory. To
build the  distribution zip file (`joern-cli.zip`), run `sbt createDistribution`.

## Configuring the JVM for handling large codebases

Code analysis can require lots of memory, and unfortunately, the JVM does not pick up the available amount of memory by itself. While tuning Java memory usage is a discipline in its own right, it is usually sufficient to specify the maximum available amount of heap memory using the JVM's -Xmx flag. There's a few different options to do that - the most convenient one is probably as follows:

```bash
./joern -J-Xmx${N}G"
```

where $N is the amount of memory in gigabytes (G). For example, to allow the JVM to use 30 gigabytes of RAM, you would issue the following:

```bash
./joern -J-Xmx30G"
```

Note that when you run `importCode` to create a new CPG, Joern spawns a separate JVM with the same max memory value, i.e. the new process will consume additional memory. If you are importing a large codebase (and/or running into memory issues), you should exit joern and invoke the CPG frontend yourself. When running `importCode` you'll get some guidance on how to do that.

```java
joern> importCode("/path/to/linux-kernel/linux-4.1.16")
Using generator for language: NEWC: CCpgGenerator
Creating project `linux-4.1.16` for code at `/path/to/linux-kernel/linux-4.1.16`
=======================================================================================================
Invoking CPG generator in a separate process. Note that the new process will consume additional memory.
If you are importing a large codebase (and/or running into memory issues), please try the following:
1) exit joern
2) invoke the frontend: /path/to/joern/joern-cli/c2cpg.sh -J-Xmx30688m /path/to/linux-kernel/linux-4.1.16 --output /path/to/joern/workspace/linux-4.1.16/cpg.bin.zip
3) start joern, import the cpg: `importCpg("path/to/cpg")`
=======================================================================================================
// ... output omitted
```

For example, you can create a CPG of (an old version of) the linux kernel as follows. Notes that Joern needs more memory than c2cpg (the C frontend which creates the CPG), because it augments the CPG with additional information and prepares it to be queried. Here we give it 100G to be safe and fast, 80G are sufficient though. Tested with Joern 1.1.1362. 

```java
./c2cpg.sh -J-Xmx30G -o linux-full.odb /home/mp/tmp/cpgtesting/linux-kernel/linux-4.1.16
./joern -J-Xmx100G
joern> importCpg("linux-full.odb")
...
res1: Option[Cpg] = Some(value = Cpg (Graph [47542978 nodes]))
```

