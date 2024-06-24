---
id: python 
title: Python 
weight: 30
---

### Frontend CLI Args
The following arguments are specific to the `pysrc2cpg` frontend.

| **Arg** | **Description** | **Type** | **Example** | **Hidden** |
| - | - | - | - | - |
| `venvDir` | Virtual environment directory. If not absolute it is interpreted relative to `input-dir` | `String` | `--venvDir "/some/path/venv/"` | `true` |
| `venvDirs` | Virtual environment directories. If not absolute it is interpreted relative to `input-dir` | `List<String>` | `--venvDirs "/some/path/venv1/, /some/path/venv2"` | `false` |
| `ignoreVenvDir` | Specifies whether `venv-dir` is ignored. Default to `true` | - | `--ignoreVenvDir` | `false` |
| `ignore-paths` | Ignores specified paths from analysis. If not absolute it is interpreted relative to `input-dir` | `List<String>` | `--ignore-paths "/path/to/ignore1, /path/to/ignore2"` | `false` |
| `ignore-dir-names` | Exclude all files where the relative path from `input-dir` contains at least one of the names specified | `List<String>` | `--ignore-dir-names "rel/path/ignore1, rel/path/ignore2"` | `true` |
| `no-dummyTypes` | Disables the generation of dummy types during type propagation | - | `--no-dummyTypes` | `true` |
| `type-prop-iterations` | Maximum iterations of type propagation | `Integer` | `--type-prop-iterations 2` | `true` |