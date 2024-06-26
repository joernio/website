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

### Calls
The section below shows how different call ASTs are modelled in Python.

The following is a simple call in Python
```python
class Foo:
  def bar(self, param1, param2, param3):
    pass 

  def baz():
    self.bar("1", 2, "3")
```
![Image of a simple call AST for a function in the same class in Python](/images/python_call.png)
The structure of the call AST:
```
CallNode
├── Receiver: self.bar
├── MethodName: bar
└── Arguments
    ├── Argument[-1]:self.bar 
    ├── Argument[0]: self 
    ├── Argument[1]: param1
    ├── Argument[2]: param2
    └── Argument[3]: parma3
```
Simple calls are modelled slightly different in dynamic languages (such as Python) when compared to static languages. In dynamic languages `arg[0]` is no longer the receiver of the call, but instead is the object that holds the property which is the receiver of the call. There is also a 5th argument introduced, which is `arg[-1]`. In Python, the `self` argument is the same as the `this` argument in other languages.

The following is a member call in Python
```python
class Foo:
  def bar(self):
    bazObj = Baz()
    bazObj.baz("1", 2, "3")

class Baz:
  def baz(self, param1, param2, param3):
    pass
```
![Image of a simple call AST for a function in a different class in Python](/images/python_member_call.png)
The structure of the call AST is mostly the same as for a simple call, with the receiver of the call now just being `Baz.baz` instead of `self.bar`.