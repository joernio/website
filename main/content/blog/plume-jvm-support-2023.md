---
title: "Plume Brings JVM Bytecode Support to Joern"
date: 2021-02-08
author: "David Baker Effendi"
email: "dave@whirlylabs.com"
---

![image](/img/plume-jvm-support-2023/plume.png)

# What is Plume?

Plume is a library which makes use of [Soot](https://soot-oss.github.io/soot/) to transform JVM
bytecode into code property graphs. Given Java class files, the JVM bytecode is transformed into
Soot's ```UnitGraph``` representation with call graphs constructed using either Class Hierarchy
Analysis (CHA) or SPARK algorithms. This intermediate representation is then fleshed out further
into the more comprehensive CPG representation using domain classes from the [Semantic Code Property
Graph](https://github.com/ShiftLeftSecurity/codepropertygraph) project.

What makes Plume special is that it is designed to be graph database agnostic. At the time of
writing, Plume can make use of 6 graph database storage back-ends where it then leverages
[OverflowDB](https://github.com/ShiftLeftSecurity/overflowdb) as a cache when fetching results from
the back-end. This is done by using a generic interface to interact with the data layer where all
graph database specific queries are handled. ![Plume's CPG extraction
process](/img/plume-jvm-support-2023/PlumeExtractorProcess_Green.png "Plume's CPG extraction
process")

![An example of some of the functions available on the driver interface and the kinds of graph
databases supported by Plume.](/img/plume-jvm-support-2023/PlumeDriver_Green_Desat.png "An example
of some of the functions available on the driver interface and the kinds of graph databases
supported by Plume.")

One can then leverage the various back-end options for remote, clustered, or embedded processing or
even as a scalable storage solution for industrial sized CPGs in memory-constrained environments.

Plume also supports serializing the resulting OverflowDB graphs to GraphML or GraphSON
after-the-fact for visualization purposes. 

![An OverflowDB result exported as GraphML and visualized using
Cytoscape.](/img/plume-jvm-support-2023/GreenGraph.png "An OverflowDB result exported as GraphML and
visualized using Cytoscape.")

# How Plume Has Integrated with Joern

Plume leverages the same domain classes and code property graph schema that Joern does while also
supporting OverflowDB as the storage back-end. This allows Joern to generate code property graphs
using Plume and picking up where it left off by importing the resulting OverflowDB and continuing by
doing further passes or analysis.

One can already start projecting CPGs from JAR files, for example, with the code
```importCode("/path/to/jar")``` command on the Joern shell. This will magically kick off Plume.
What also works is using the CLI command ```./joern-parse --language java /path/to/jar``` followed
by ```importCpg``` on the Joern shell.

Plume can also work as a standalone CPG generator but it does not support any analysis.

For more details on how to leverage Plume for JVM bytecode analysis, have a look at the
documentation for [Plume](https://plume-oss.github.io/plume-docs/) and
[Joern](https://docs.joern.io/home).