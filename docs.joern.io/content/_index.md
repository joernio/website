---
title: Overview
id: home
weight: 10
---

Welcome to the documentation of the code analysis platform Joern! For
a high-level overview, please also check out https://joern.io .


Joern is a platform for robust analysis of source code, bytecode, and binary code.
It generates code property graphs, a graph representation of code for 
cross-language code analysis. Code property graphs are stored
in a custom graph database. This allows code to be mined using search
queries formulated in a Scala-based domain-specific query
language. Joern is developed with the goal of providing a useful tool
for vulnerability discovery and research in static program analysis.

## Supported languages

| Name         | Built with   | Maturity |
|--------------|--------------|----------|
| C/C++        | Eclipse CDT  | High     |
| Java         | JavaParser   | High     |
| JavaScript   | GraalVM      | High     |
| Python       | JavaCC       | High     |
| x86/x64      | Ghidra       | Medium   |
| JVM Bytecode | Soot         | Medium   |
| Kotlin       | IntelliJ PSI | Medium   |
| PHP          | PHP-Parser   | Medium   |
| Go           | go.parser    | Low      |
| Ruby         | ANTLR        | Low      |
| Swift        | SwiftSyntax  | Low      |
| C#           | Roslyn       | Low      |


## Core features

The core features of Joern are:

- **Robust parsing.** Joern allows importing code even if a working
  build environment cannot be supplied or parts of the code are missing.

- **Code Property Graphs.** Joern creates semantic code property graphs
  from the fuzzy parser output and stores them in an in-memory graph
  database. SCPGs are a language-agnostic intermediate representation
  of code designed for query-based code analysis.

- **Taint Analysis.** Joern provides a taint-analysis engine that allows
   the propagation of attacker-controlled data in the code to be analyzed
   statically.

- **Search Queries.** Joern offers a strongly-typed Scala-based extensible
  query language for code analysis based on Gremlin-Scala. This language	
  can be used to manually formulate search queries for vulnerabilities
  as well as automatically infer them using machine learning
  techniques. 

- **Extendable via CPG passes.** Code property graphs are
  multi-layered, offering information about code on different levels of
  abstraction. Joern comes with many default passes, but also allows
  users to add passes to include additional information in the graph,
  and extend the query language accordingly.
