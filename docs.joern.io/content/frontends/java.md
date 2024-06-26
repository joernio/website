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

### Calls
The section below shows how different call ASTs are modelled in Java.

The following is a simple call in Java:
```java
class Foo {
  public void bar(String param1, Integer param2, String param3) {
    s.length()
  }

  public void baz() {
    bar("1", 2, "3")
  }
}
```
![Image of a simple call AST for a function in the same class in Java](/images/java_call.png)
The structure of the call AST:
```
CallNode
├── Receiver: this
├── MethodName: bar
└── Arguments
    ├── Argument[0]: this 
    ├── Argument[1]: param1
    ├── Argument[2]: param2
    └── Argument[3]: param3
```
Note that the method signature in the Java code only has three arguments, but the call AST has four. There is an implicit argument that is added in the 0th position, which is the `receiver` of the call node. In this case since the call is invoking a method defined in the same class, so an implicit `this` argument is added at `arg[0]` as the `receiver` of the call. Note that dynamic methods (i.e methods without the `static` modifier) also have a `this` 0th parameter that lines up with the `this` 0th argument in the `CallNode`.

The following is a static member call in Java:
```java
class Foo {
  public void bar() {
    Baz.bazFunc("1", 2, "3");
  }
}

class Baz {
  public static int bazFunc(String param1, Integer param2, String param3) {
    return 1
  }
}
```
![Image of a simple call AST for a static function in a different class in Java](/images/java_static_call.png)

The structure of the call AST for the static function is the same as it is for the simple call above, the only difference is that the `receiver` (and thus `arg[0]`) of the call has now changed to `Baz` since the method being invoked is defined in the `Baz` class.
