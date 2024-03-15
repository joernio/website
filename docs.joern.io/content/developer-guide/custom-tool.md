---
id: custom-tool
title: Creating a Custom Static Analysis with Joern
weight: 40
---

So you want to develop tools with Joern? Let's get started!

## Simple Standalone Application Template

[standalone-ext](https://github.com/joernio/standalone-ext) is the core template for developing
Joern-based tooling. Here are some tasks you can perform using this template to suite your needs:

* Update to latest Joern versions? Run `./updateDependencies.sh`
* Extend the CPG schema for custom nodes/edges/properties? See [`CpgExtSchema`](https://github.com/joernio/standalone-ext/blob/master/schema/src/main/scala/CpgExtSchema.scala)
* Want to create a CLI tool? See [`Main`](https://github.com/joernio/standalone-ext/blob/master/src/main/scala/org/codeminers/standalone/Main.scala)
* Want to create a REPL? See [`ReplMain`](https://github.com/joernio/standalone-ext/blob/master/src/main/scala/org/codeminers/standalone/ReplMain.scala)
* Want to add custom query steps? See [`package`](https://github.com/joernio/standalone-ext/blob/master/src/main/scala/org/codeminers/standalone/package.scala)

Joern modules can be imported, as well as their test resources, e.g.

```scala
// build.sbt

// parsed by project/Versions.scala, updated by updateDependencies.sh
val cpgVersion        = "1.6.5"
val joernVersion      = "2.0.262"
val overflowdbVersion = "1.187"
// ...
val joernDeps =
  Seq("x2cpg", "javasrc2cpg", "joern-cli", "semanticcpg", "dataflowengineoss")
    .flatMap { x =>
      val dep     = "io.joern" %% x % Versions.joern
      val testDep = "io.joern" %% x % Versions.joern % Test classifier "tests"
      Seq(dep, testDep)
    }
libraryDependencies ++= Seq(/*...*/) ++ joernDeps
```

With the test resources, you have access to the same text fixtures and tooling that Joern has,
notably, the ability to generate CPG to test against from source code blocks.

## Examples

Here are some open-source tools developed from `standalone-ext`:

* [Privado Core](https://github.com/Privado-Inc/privado-core)
* [JoernTI](https://github.com/joernio/joernti-codetidal5)
* [CPG Miner](https://github.com/DavidBakerEffendi/cpg-miner)

Add your project here!
