---
title: "Joern Year Update 2023"
date: 2023-12-04
author: "David Baker Effendi"
email: "dave@whirlylabs.com"
---

# Major Updates and News

The Joern blog and community updates have been quiet since the last update at the end of 2021, but
the team has not stopped working in the background to bring you major updates. In this blog, we'll
be talking about the new companies sponsoring resources to developing Joern, and the future of the
project.

## New Primary Maintainer

We are proud to announce the new primary maintainer of Joern!

![Whirly Labs Logo](/img/sponsor/WhirlyLabs.png "Whirly Labs Logo")

Fabian Yamaguchi and his partner, Kate Yamaguchi, founded [Whirly Labs](https://whirlylabs.com), an IT security
and software analysis development company, based in Cape Town, South Africa. Whirly Labs is now the
primary maintainer of Joern, and Fabian and I have worked hard to bring in and facilitate the rapid
development of Joern these past years, both as a research tool as well as an industry-level static
analysis framework.

One major change is that [joern.io](https://joern.io) (the website you are now on), has been
rewritten to be based on [Hugo](https://gohugo.io), by [Davey Lupes](https://twitter.com/daveylupes)
of Whirly Labs. It is near-identical to the original website, with minor visual improvements
here-and-there, but the main value is that it is largely easier to update and maintain.

## Secondary Maintainers & Supporting Organizations

We are extremely fortunate to have received such a large interest from the international community,
both in industry and academia. Notably, [QwietAI](https://qwiet.ai) (formerly ShiftLeft) and
[Privado](https://www.privado.ai) have poured a significant combination of financial and developer 
resources into the project. The result is that the project now supports a number of new languages
and program analysis features.

{{< figure src="/img/sponsor/QwietAI.png" class="px-5 mx-5" caption="QwietAI's developers have maintained the database, schema, querying, and C/C++/Ghidra/Kotlin/Python/JavaScript/Java/PHP/Ruby/Swift support. They are also the majority of who help newcomers on the Discord channel and handle incoming issues on GitHub.">}}
{{< figure src="/img/sponsor/Privado.png" class="px-5 mx-5" caption="Privado has fueled the development of extra features in Java/Python/JavaScript and the data-flow engine. They have also funded the type propagation initiative, and initiated the development of the Ruby & C# frontends. Their core analysis framework is also open-source.">}}

We've noted continuous research interest and projects using Joern by both [Stellenbosch
University](http://www.sun.ac.za/english) and [Technische Universität
Braunschweig](https://www.tu-braunschweig.de/en/), and welcome new research partners from
[Technische Universität Berlin](https://www.tu.berlin), [Universität Bremen](https://www.uni-bremen.de/en/),
and [Columbia University](https://www.columbia.edu).

If I've missed your name, or you are interested in collaborating on developing Joern, please reach
out to us!

## New Languages & Features

Since the last update, Joern has had a number of new languages added, as well as improvements to the
general static analysis capabilities.

### Frontend Updates

* `c2cpg` was moved from ANLTR to Eclipse CDT.
* `jimple2cpg` had a refresher, and the community added support for APKs.
* `javasrc2cpg` is a well supported Java source code frontend to take over from `jimple2cpg`.
* `jssrc2cpg` and `pysrc2cpg` were introduced and matured.
* `php2cpg` and `kotlinsrc2cpg` are on their way to maturity.
* `rubysrc2cpg` and `gosrc2cpg` are spanking new and on their way to being ready very soon.

### Core Feature Updates

* An experimental type propagation and import handling was developed to improve Joern's ability to
  be robust to partial programs and dynamic language features.
* Regex-based semantic definitions are now available, with the ability to specify named arguments.
* We've moved from Scala 2 to Scala 3.

### Planned Features & Language Support

* The new replacement for OverflowDB is on the way! Look forward to improved memory consumption and
  general performance.
* Lambda support for the data-flow engine is not fully matured, and there are plans to handle this
  better.
* `csharpsrc2cpg` and `swiftsrc2cpg` have started development, so you can expect these to be ready
  sometime in 2024! 

It is important to note that many of these features were handled and developed by the teams at
QwietAI and Privado, and we couldn't have done this without them.

# Next Steps

We look forward to a productive 2024, and to see Joern grow as one of the largest and reliable
open-source static analysis tools. We thank the community for their patience, as interest has fast
outgrown the ability for everyone to keep up with all the issues, but we're determined to continue
to keep the standard high and help where we can.

In the mean time, we need help! For Joern, we need DevOps, documentation, and general development.
If any of these interest you then reach out to me directly see contact details below:

Email: dave@whirlylabs.com  
Twitter: [@SDBakerEffendi](https://twitter.com/SDBakerEffendi)  
GitHub: [@DavidBakerEffendi](https://github.com/DavidBakerEffendi) 

Also, check out [careers @ WhirlyLabs](https://whirlylabs.com/careers/) for open roles.
