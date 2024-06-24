---
id: java 
title: Java 
weight: 10
---

### Frontend CLI Args
The following arguments are specific to the `javasrc2cpg` frontend.

| **Arg** | **Description** | **Type** | **Example** | **Hidden** |
| - | - | - | - | - |
| `inference-jar-paths` | Paths to extra jars used only for type information | `List<String>` | `--inference-jar-paths "/path/ex1.jar, /path/ex2.jar"` | `false` |
| `fetch-dependences` | Attempts to fetch dependencies jars for extra type information | - | `--fetch-dependencies` | `false` |
| `delombok-java-home` | Optional override to set java home used to run Delombok. Recommended to use Java 17 for best results| `String` | `--delombok-java-home /path/to/home` | `false` |
| `delombok-mode` | Specifies how Delombok should be executed | `no-delombok \| default \| types-only \| run-delombok` | `--delombok-mode no-delombok` | `false` |
| `enable-type-recovery` | Enable generic type recovery. | - | `--enable-type-recovery` | `true` |
| `jdk-path` | JDK path used for resolving builtin Java types. If not set, current classpath will be used | `String` | `--jdk-path /path/to/jdk` | `false` |
| `show-env` | Print information about the environment variables used by `javasrc2cpg` and exit Joern | - | `--show-env` | `false` |
| `skip-type-inf-pass` | Skip the type inference pass. Results will be much worse, so should only be used for development. | - | `--skip-type-inf-pass` | `true` |
| `dump-javaparser-asts` | Dump the `javaparser` ASTs for the given input files and exit Joern. Used for debugging | - | `--dump-javaparser-asts` | `true` |
| `cache-jdk-type-solver` | Re-use the JDK type solver between scans | - | `--cache-jdk-type-solver` | `true` |
| `keep-type-arguments` | Type full names of variables keep their type arguments | - | `--keep-type-arguments` | `true` |
| `no-dummyTypes` | Disables the generation of dummy types during type propagation | - | `--no-dummyTypes` | `true` |
| `type-prop-iterations` | Maximum iterations of type propagation | `Integer` | `--type-prop-iterations 2` | `true` |