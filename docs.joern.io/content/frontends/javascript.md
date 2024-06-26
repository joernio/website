---
id: javascript
title: JavaScript
weight: 20
---

### Frontend Args
The following arguments are specific to the `jssrc2cpg` frontend.

| **Arg** | **Description** | **Type** | **Example** | **Hidden** |
| - | - | - | - | - |
| `no-tsTypes` | Disable generation of types via `TypeScript` | - | `--no-tsTypes` | `true` |
| `no-dummyTypes` | Disables the generation of dummy types during type propagation | - | `--no-dummyTypes` | `true` |
| `type-prop-iterations` | Maximum iterations of type propagation | `Integer` | `--type-prop-iterations 2` | `true` |

### Calls
The section below shows how different call ASTs are modelled in JavaScript.
```javascript
class Foo {
  bar(param1, param2, param3) {
    // do something
  }

  baz(param1, param2, param3) {
    bar("1", 2, "3")
  }
}
```
![Image of a simple call AST for a function in the same class in JavaScript](/images/javascript_call.png)
The structure of the call AST:
```
CallNode
├── Receiver: this.bar
├── MethodName: bar
└── Arguments
    ├── Argument[-1]: bar
    ├── Argument[0]: this 
    ├── Argument[1]: param1
    ├── Argument[2]: param2
    └── Argument[3]: param3
```
Simple calls are modelled slightly different in dynamic languages (such as JavaScript) when compared to static languages. In dynamic languages `arg[0]` is no longer the receiver of the call, but instead is the object that holds the property which is the receiver of the call. There is also a 5th argument introduced, which is `arg[-1]`.

The following is a static member call in JavaScript:
```javascript
class Foo {
  bar(param1, param2, param3) {
    Baz.baz("1", 2, "3")
  }
}

class Baz {
  static baz(param1, param2, param3) {
    // do something
  }
}
```
![Image of a simple call AST for a static function in a different class in JavaScript](/images/javascript_static_call.png)
The structure of the call AST is mostly the same as for a simple call, with the receiver of the call now just being `Baz.baz` instead of `self.bar`.
