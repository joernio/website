---
id: x2cpg 
title: X2CPG
weight: 5
---

## Frontend Args
The frontend arguments for `x2cpg` is shared across all frontends for `Joern`. See the individual Frontend pages for frontend-specific args.

| **Arg** | **Description** | **Type** | **Example** |
| - | - | - | - |
| `input-dir` | Directory containing all source files to be used with Joern | `String` | `"/some/path/to/folder"` |
| `output` | Name of the file where output is written to | `String` | `--output "output.txt"` |
| `exclude` | List of input file names to be excluded during CPG generation (paths must be relative to `input-dir` or absolute paths) | `List<String>` | `--exclude "test1.java, test2.java, ..."` |
| `exclude-regex` | A regex specifying files to be excluded during CPG generation (paths must be relative to `input-dir` or absolute paths) | `String` | `--exclude-regex ".*-test.java"` |
| `enable-early-schema-checking` | Enables early schema validation during AST creation (disabled by default)| - | `--enable-early-schema-checking` |
| `enable-file-content` | Add the raw source code to the content of the FILE nodes to allow for method source retrieval via offset fields (disabled by default) | - | `--enable-file-content` |