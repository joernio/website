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