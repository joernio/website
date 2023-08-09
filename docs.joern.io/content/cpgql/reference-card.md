---
id: reference-card
title: Reference Card
---

### Node-Type Steps

| Step  | Description   |
| ------------- | ------------- |
| `all`      | All nodes |
| `argument`      | All arguments (actual parameters) |
| `assignment` | All assignments |
| `call`      | All call sites |
| `comment`      | All comments (only source-based CPGs) |
| `controlStructure` | All control structures (also `break`, `continue`, `ifBlock` etc. for specific structures) |
| `file`      | All source files |
| `identifier`      | All identifiers, e.g.  occurrences of local variables or class members in method bodies |
| `literal`      | All literals, e.g. numbers or strings  |
| `local`      | All local variables |
| `member`      | All members of complex types, e.g. classes, structs |
| `metaData`      | The meta data node |
| `method`      | All methods |
| `methodRef`      | All method references |
| `methodReturn`      | All formal return paramters |
| `namespace`      | All namespaces |
| `namespaceBlock`      | All namespace blocks |
| `parameter`      | All parameters  |
| `returns`      | All actual return parameters |
| `tag`      | All tags |
| `typeDecl`      | All declarations of types |
| `typeRef`      | All type references |

### Core Steps

| Step  | Description   |
| ------------- | ------------- |
| `clone` | Create a deep copy of the traversal |
| `dedup`      |  Deduplicate results in a traveral |
| `map`      | Transform the traversal by a given function |
| `sideEffect`      | Extend the traversal with a side-effect step by applying a function |

### Filter Steps

| Step | Description   |
| ----------- | ------------- |
| `and`  | The _and_ step is a filter with multiple _and_ related filter traversals. |
| `filter`      | Keep nodes for which the provided `predicate` returns true |
| `filterNot`   | Keep nodes for which the provided `predicate` returns false |
| `where`     | Traversal proceeds for steps with non-empty returns for the provided `predicate` |
| `whereNot`  | Traversal proceeds for steps with empty returns for the provided `predicate` |
| `or`  | The _or_ step is a filter with multiple _or_ related filter traversals. |

### Repeat Steps

| Step  | Description   |
| ------------- | ------------- |
| `repeat`      | Repeat the given traversal. This step can be combined with the until and emit steps to provide a termination and emit criteria. |
| `until`      | Termination criteria for a repeat step. If used before the repeat step it as "while" characteristics. If used after the repeat step it as "do-while" characteristics. |
| `times`      | Modifier for repeat steps. Configure the amount of times the repeat traversal is executed. |
| `emit`      | Emit is used with the repeat step to emit the elements of the repeatTraversal after each iteration of the repeat loop. |

### Complex Steps

| Step | Description |
| ---- | ----------- |
| `callee` | List all nodes representing Call Graph callees of the traversed nodes |
| `caller` | List all nodes representing Call Graph callers of the traversed nodes |
| `callIn` | List all nodes representing Call Graph parent call-sites of the traversed nodes |
| `controlledBy` | Returns only those dataflows that are wrapped by a given AST control condition (>, <, =, etc.)|
| `dump`      | Execute the traversal and return the CODE property with syntax highlighting |
| `dumpRaw`      | Execute the traversal and return the CODE property without syntax highlighting |
| `inCall` | Lists all nodes representing surrounding Call Graph call-sites of the traversed nodes |
| `locations`      | List of all locations nodes traversed in a given dataflow |
| `notControlledBy`      | Returns only those flows that are NOT wrapped by a given AST control condition (>, <, =, etc.) |
| `reachableBy`      | Find if a given source node is reachable by a sink via a dataflow |
| `reachableByFlows` | Find paths for flows of data from sinks to sources |
| `sink`      | List of all nodes identified as potential sensitive sinks the natured of methods, literals, types etc. associated with them |
| `source`      | List of all nodes identified as sensitive/attacker-controlled due to the natured of methods, literals, types etc. associated with them |
| `tagList`      | Execute the traversal and return TAG nodes connected to each of the nodes |

### Execution Directives

| Directive  | Description   |
| ------------- | ------------- |
| `toList`      | Execute the traversal and convert the result to a list |
| `l`      | Shorthand for `toList` |
| `toJson`      | Execute the traversal and convert the result to JSON |
| `toJsonPretty`      | Execute the traversal and convert the result to prettified JSON |
| `p`      | Execute the traversal and pretty print the results |
| `browse`      | Execute the traversal and pretty print the results in `less` |
| `size`      | Execute the traversal and return the size of the array of nodes |

### Help Directive

| Directive  | Description   |
| ------------- | ------------- |
| `help`      | Print help based on the current element type |

### Augmentation Directives

| Directive  | Description   |
| ------------- | ------------- |
| `newTagNode`      | Tag node with a specific name |
| `newTagNodePair`      | Tag node with a specific name and value |
| `store` | Store changes in the current DiffGraph |

