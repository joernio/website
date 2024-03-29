---
id: shell
title: Interactive Shell
weight: 70
---

Joern provides an interactive shell for code analysis, much like an
operating system shell. We base this shell on [scala-repl-pp](https://github.com/mpollmeier/scala-repl-pp/) which is an extension of the stock Scala repl. In summary, the shell offers the following major features:

* Tab-completion
* GNU readline support for line editing
* Pipe operators (`#>`, `#>>`, `#|` etc)
* Results browsing with a pager
* Add dependencies with maven coordinates
* Server mode
* Structured output rendering including product labels and type information


## Launching the Interactive Shell

The shell can be started by issuing the following command:

```shell
$ joern
```

## Basic Keyboard Commands

The Joern underlying shell is essentially an interactive Scala shell that supports the following keyboard commands:

| **Command** | **Description** |
| - | - |
| CTRL-c | Cancels current operation/clears shell. Does *not* quit Joern |
| CTRL-d | Quits Joern (shell must be clear) |
| TAB | Autocomplete |
| UP | Moves through command history |
| CTRL-LEFT/RIGHT | Step through commands word-by-word (instead of character-by-character) |
| CTRL-r | Searches command history. Use CTRL-r (or UP/DOWN) to cycle through your matches |

## Exporting Results with Pipe Operators and `toJson`

Inspired by unix shell redirection and pipe operators (`>`, `>>` and `|`) you can redirect output into files with `#>` (overrides existing file) and `#>>` (create or append to file), and use `#|` to pipe the output to an external command:

```java
// write results to file (first overrides, seconds appends)
cpg.method.name #> "/tmp/methods.txt"
cpg.method.name #>> "/tmp/methods.txt"

// render methods as json, then export to file
cpg.method.toJsonPretty #> "/tmp/methods.json"

// pipe results to external command
cpg.method.name #| "cat" 

// same as above, but make that command inherit stdin/stdout
// this is what happens internally if you run `cpg.method.name.browse`
cpg.method.name #|^ "less"
```


## Inline Code Browsing

For an increasing number of languages, the Joern shell allows you to
read code associated with query results directly on the shell. For
example, to review all calls to `memcpy`, you can issue:

```java
joern> cpg.method.name("memcpy").callIn.code.l

res5: List[String] = List(
  "memcpy(buf, first, first_len)",
  "memcpy(buf + first_len, second, second_len)",
  "memcpy(buf, first, first_len)",
  "memcpy(buf + first_len, second, second_len)",
  "memcpy(buf + first_len, second, second_len)",
  "memcpy(buf, first, first_len)"
)
```

You can also pipe the result list into a pager (`less`) as follows:

```java
joern> cpg.method.name("memcpy").callIn.code.browse
```


To study the context in which a result occurs, you can use the .dump
method, which will dump the enclosing function’s code for each
finding, and point you to the finding via an arrow:

```c
joern> cpg.method.name("memcpy").callIn.dump

int main() {
  unsigned int first_len = UINT_MAX - 256;
  unsigned int second_len = 256;
  unsigned int buf_len = 256;

  char first[first_len], second[second_len], buf[buf_len];
  int new_len = (first_len+second_len); // <- IDB (negative)

  if(new_len <= 256) {
	memcpy(buf, first, first_len);
        memcpy(buf + first_len, second, second_len); /* <=== */
  }
}

...
```
You can use this feature together with browse to read code in the
pager. Finally, if you want to read the code in your editor of choice,
just dump it to a file:

```bash
cpg.method.name("memcpy").callIn.dumpRaw #> "/tmp/foo.c"
```

We use `dumpRaw` here to skip syntax highlighting, as your editor will
most likely do that for you.

{{< hint info >}}
Please make sure
[source-highlight](https://www.gnu.org/software/src-highlite/) is
installed for the `.dump` feature to work.
{{< /hint >}}

### Dynamically Importing Additional Scripts

You can dynamically load additional scripts at any time.

As an example, let's assume there's a file called `MyScript.sc` that contains only `val elite = 31337`. You can import the script as follows:

```java
//> using file MyScript.sc

> importing /home/mp/Projects/shiftleft/joern/./MyScript.sc (1 lines)
val elite: Int = 31337
```

You can specify the filename with relative or absolute paths:
```java
//> using file scripts/MyScript.sc
//> using file ../MyScript.sc
//> using file /path/to/MyScript.sc
```

### Adding Dependencies to the JVM `classpath` on startup
Note: this used to also work dynamically (i.e. add dependencies to a running repl), but as of joern 2.0.0 all dependencies must be known at startup. 

Option 1: via `--dep` parameter
```shell
./joern --dep com.michaelpollmeier:versionsort:1.0.7
joern> versionsort.VersionHelper.compare("1.0", "0.9")
val res0: Int = 1
```
To add multiple dependencies, you can specify this parameter multiple times.

Option 2: use the `//> using dep` directive in an imported script:
```shell
echo '//> using dep com.michaelpollmeier:versionsort:1.0.7' > predef.sc
./joern --import predef.sc

joern> versionsort.VersionHelper.compare("1.0", "0.9")
val res0: Int = 1
```

For Scala dependencies use `::`:
```java
./joern --dep com.michaelpollmeier::colordiff:0.36
colordiff.ColorDiff(List("a", "b"), List("a", "bb"))
// color coded diff
```

### Additional dependency resolvers and credentials
If your dependencies are not hosted on maven central, you can specify additional resolvers - including those that require authentication:

Option 1: via `--repo` parameter on startup:
```bash
./joern --repo "https://repo.gradle.org/gradle/libs-releases" --dep org.gradle:gradle-tooling-api:7.6.1
org.gradle.tooling.GradleConnector.newConnector()
```
To add multiple dependency resolvers, you can specify this parameter multiple times.

Or via `//> using resolver` directive as part of a script:

script-with-resolver.sc
```scala
//> using resolver https://repo.gradle.org/gradle/libs-releases
//> using dep org.gradle:gradle-tooling-api:7.6.1
println(org.gradle.tooling.GradleConnector.newConnector())
```
```scala
./joern --script script-with-resolver.sc
```

If one or multiple of your resolvers require authentication, you can configure your username/passwords in a [`credentials.properties` file](https://get-coursier.io/docs/other-credentials#property-file):
```
mycorp.realm=Artifactory Realm
mycorp.host=shiftleft.jfrog.io
mycorp.username=michael
mycorp.password=secret

otherone.username=j
otherone.password=imj
otherone.host=nexus.other.com
```
The prefix is arbitrary and is only used to specify several credentials in a single file. joern uses [coursier](https://get-coursier.io) to resolve dependencies. 


### Measuring the Time While Running a Computation

```java
time { 
  println("long running computation")
  Thread.sleep(1000)
  42
}
// res: (42, 1000332390 nanoseconds)
```

