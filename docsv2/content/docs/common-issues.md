---
id: common-issues
title: Common Issues
weight: 120
---

This article is a collection of issues which come up frequently.


## Dataflows are not found

Dataflow queries which do not give a result are usually caused by a
forgotten call to `run.ossdataflow`.

__NOTE:__ As of Joern v1.1.299, it is no longer necessary to call
`run.ossdataflow` explicitly. This is done as an automatic step during
CPG creation.

## No suitable CPG generator found for: `<source_path>`

There are 3 possible explanations for this error:

### The `<source_path>` provided is invalid: 
Confirm that the `<source_path>` provided exists. To do this, execute the following
command from the same directory from which you started Joern:
```shell
ls <source_path>
```

### The language isn't supported
You can run `joern-scan --list-languages` to get a list of all the languages supported
by Joern/Ocular. If the language you're using does not appear on this list, then it 
definitely isn't supported by Joern. If it does appear, then it may only be supported by
Ocular.

### Automatic language detection failed
You can specify the lanugage to use by running 
```shell
joern-scan --language <language> # and other opts
```
for joern-scan, or with
```shell
joern> importCode.<language>(<path_to_src>)
```
in the Joern console.
