---
id: node-type-steps
title: Node-Type Steps
---

Node-Type Steps are CPGQL Steps that traverse nodes based on their type.

### Overview

| Step      | Description |
| -------- | ----------- |
| [all](#all) |  Visits all nodes in the Code Property Graph |
| [block](#block) |  Visits BLOCK nodes |
| [call](#call) |  Visits CALL nodes, represent call-sites |
| [comment](#comment) |  Visits COMMENT nodes, COMMENT nodes exist only for source-based Code Property Graphs |
| [file](#file) |  Visits FILE nodes, in source-based Code Property Graphs, FILE nodes will point both to the actual source code files of the program under analysis and paths to the referenced files from the standard library, for IR-based Code Property Graphs, the nodes representing source code files will not exist |
| [identifier](#identifier) |  Visits IDENTIFIER nodes; e.g. occurrences of local variables or class members in method bodies  |
| [literal](#literal) |  Visits LITERAL nodes; e.g. numbers or strings |
| [local](#local) |  Visits LOCAL nodes; represent local variable |
| [member](#member) |  Visits MEMBER nodes; MEMBER nodes refer to members of complex types like classes or structs |
| [metaData](#metadata) |  Visits the META_DATA node |
| [method](#method) |  Visits METHOD nodes |
| [methodRef](#methodref) |  Visits METHOD_REF nodes |
| [methodReturn](#methodreturn) |  Visits METHOD_RETURN nodes; all formal return parameters |
| [modifier](#modifier) |  Visits MODIFIER nodes; e.g. public, private, static |
| [namespace](#namespace) |  Visits NAMESPACE nodes |
| [namespaceBlock](#namespaceblock) |  Visits NAMESPACE_BLOCK nodes |
| [parameter](#parameter) |  Visits PARAMETER nodes |
| [returns](#returns) |  Visits RETURN nodes |
| [typeDecl](#typedecl) |  Visits TYPE_DECL nodes |
| [tag](#tag) |  Visits TAG nodes |
| [typ](#typ) |  Visits TYPE nodes |


## all

The `all` Node-Type Step represents a traversal which visits all nodes of a Code Property Graph. It supports the two only _Property Directives_ which are common to all _Node-Type Steps_, `id` and `label`.

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| id | int | Unique node identifier |
| label | string | Returns the value of the LABEL property which represents the node type |

Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| file | Visits FILE nodes attached to all nodes in the graph |
| tag | Visits TAG nodes attached to all nodes in the graph |

Supported Complex Steps

_None._

## block

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| argumentIndex | int | Identifies different AST children of CALL nodes or BLOCK nodes. Ordered 1 to N, with 0 reserved for implicit arguments like this or self |
| id | int | Unique node identifier |
| label | string | Returns the value of the LABEL property which represents the node type |
| lineNumber | int | First line at which the code representing this node is found |
| order | int | General ordering property for AST nodes |


Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| call | Visits CALL nodes; represent call-sites |
| file | Visits FILE nodes; in source-based Code Property Graphs, FILE nodes will point both to the actual source code files of the program under analysis and paths to the referenced files from the standard library, for IR-based Code Property Graphs, the nodes representing source code files will not exist |
| local | Visits LOCAL nodes; represent local variable |
| tag | Visits TAG nodes |
| typ | Visits TYPE nodes |

Supported Complex Steps

| Complex Step | Description |
| ------------ | ----------- |
| location | |

## call

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| code | string | The source code construct this node represents |
| id | int | Unique node identifier |
| label | string | Returns the value of the LABEL property which represents the node type |
| lineNumber | int | First line at which the code representing this node is found |
| name | string | General string identifier for various nodes |

Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| call | Visits CALL nodes; represent call-sites |
| file | Visits FILE nodes; in source-based Code Property Graphs, FILE nodes will point both to the actual source code files of the program under analysis and paths to the referenced files from the standard library, for IR-based Code Property Graphs, the nodes representing source code files will not exist |
| method | Visits METHOD nodes |
| parameter | Visits PARAMETER nodes |
| tag | Visits TAG nodes |

Supported Complex Steps

| Complex Step | Description |
| ------------ | ----------- |
| argument | Visits nodes connected by ARGUMENT edges; actual parameters |
| isDynamic | |
| isStatic | |
| location | |

## comment

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| id | int | Unique node identifier |
| code | string | The source code construct this node represents |
| label | string | Returns the value of the LABEL property which represents the node type |
| lineNumber | int | First line at which the code representing this node is found |

Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| file | Visits FILE nodes; in source-based Code Property Graphs, FILE nodes will point both to the actual source code files of the program under analysis and paths to the referenced files from the standard library, for IR-based Code Property Graphs, the nodes representing source code files will not exist |
| tag | Visits TAG nodes |

Supported Complex Steps

| Complex Step | Description |
| ------------ | ----------- |
| location | |

## file

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| id | int | Unique node identifier |
| label | string | Returns the value of the LABEL property which represents the node type |
| name | string | General string identifier for various nodes |
| order | int | General ordering property for AST nodes |

Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| file | Visits FILE nodes; in source-based Code Property Graphs, FILE nodes will point both to the actual source code files of the program under analysis and paths to the referenced files from the standard library, for IR-based Code Property Graphs, the nodes representing source code files will not exist |
| namespace | Visits NAMESPACE nodes |
| namespaceBlock | Visits NAMESPACE_BLOCK nodes |
| tag | Visits TAG nodes |
| typeDecl | Visits TYPE_DECL nodes |

Supported Complex Steps

| Complex Step | Description |
| ------------ | ----------- |
| location | |

## identifier

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| code | string | The source code construct this node represents |
| id | int | Unique node identifier |
| label | string | Returns the value of the LABEL property which represents the node type |
| lineNumber | int | First line at which the code representing this node is found |
| name | string | General string identifier for various nodes |
| order | int | General ordering property for AST nodes |

Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| file | Visits FILE nodes; in source-based Code Property Graphs, FILE nodes will point both to the actual source code files of the program under analysis and paths to the referenced files from the standard library, for IR-based Code Property Graphs, the nodes representing source code files will not exist |
| parameter | Visits PARAMETER nodes |
| tag | Visits TAG nodes |
| typ | Visits TYPE nodes |

Supported Complex Steps

| Complex Step | Description |
| ------------ | ----------- |
| location | |

## literal

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| code | string | The source code construct this node represents |
| id | int | Unique node identifier |
| label | string | Returns the value of the LABEL property which represents the node type |
| lineNumber | int | First line at which the code representing this node is found |
| order | int | General ordering property for AST nodes |

Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| call | Visits CALL nodes; represent call-sites |
| file | Visits FILE nodes; in source-based Code Property Graphs, FILE nodes will point both to the actual source code files of the program under analysis and paths to the referenced files from the standard library, for IR-based Code Property Graphs, the nodes representing source code files will not exist |
| method | Visits METHOD nodes |
| parameter | Visits PARAMETER nodes |
| tag | Visits TAG nodes |
| typ | Visits TYPE nodes |

Supported Complex Steps

| Complex Step | Description |
| ------------ | ----------- |
| location | |

## local

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| code | string | The source code construct this node represents |
| id | int | Unique node identifier |
| label | string | Returns the value of the LABEL property which represents the node type |
| lineNumber | int | First line at which the code representing this node is found |
| name | string | General string identifier for various nodes |
| order | int | General ordering property for AST nodes |

Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| file | Visits FILE nodes; in source-based Code Property Graphs, FILE nodes will point both to the actual source code files of the program under analysis and paths to the referenced files from the standard library, for IR-based Code Property Graphs, the nodes representing source code files will not exist |
| tag | Visits TAG nodes |
| typ | Visits TYPE nodes |

Supported Complex Steps

| Complex Step | Description |
| ------------ | ----------- |
| location | |

## member

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| code | string | The source code construct this node represents |
| id | int | Unique node identifier |
| label | string | Returns the value of the LABEL property which represents the node type |
| name | string | General string identifier for various nodes |
| order | int | General ordering property for AST nodes |

Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| file | Visits FILE nodes; in source-based Code Property Graphs, FILE nodes will point both to the actual source code files of the program under analysis and paths to the referenced files from the standard library, for IR-based Code Property Graphs, the nodes representing source code files will not exist |
| modifier | Visits MODIFIER nodes; e.g. public, private, static |
| tag | Visits TAG nodes |
| typ | Visits TYPE nodes |
| typeDecl | Visits TYPE_DECL nodes |

Supported Complex Steps

| Complex Step | Description |
| ------------ | ----------- |
| location | |

## metaData

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| id | int | Unique node identifier |
| label | string | Returns the value of the LABEL property which represents the node type |
| language | string | The programming language this graph originates from |
| version | string | A version, given as a string |

Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| tag | Visits TAG nodes |
| file | Visits FILE nodes; in source-based Code Property Graphs, FILE nodes will point both to the actual source code files of the program under analysis and paths to the referenced files from the standard library, for IR-based Code Property Graphs, the nodes representing source code files will not exist |

Supported Complex Steps

| Complex Step | Description |
| ------------ | ----------- |
| location | |

## method

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| fullName | string | General string identifier which includes various details of the node it is defined on |
| id | int | Unique node identifier |
| isExternal | boolean | Indicates that the node represents a program construct that is not defined directly in its source code |
| label | string | Returns the value of the LABEL property which represents the node type |
| lineNumber | int | First line at which the code representing this node is found |
| lineNumberEnd | int | Last line at which the code representing this node is found |
| name | string | General string identifier for various nodes |
| order | int | General ordering property for AST nodes |
| signature | string | The method signature; usually includes the method name, and the number, types and order of its parameters |

Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| local | Visits LOCAL nodes; represent local variable |
| method | Visits METHOD nodes |
| methodReturn | Visits METHOD_RETURN nodes; all formal return parameters |
| modifier | Visits MODIFIER nodes; e.g. public, private, static |
| namespace | Visits NAMESPACE nodes |
| parameter | Visits PARAMETER nodes |
| tag | Visit TAG nodes attached to the METHOD nodes; that is, tags found on methods |

Supported Complex Steps

| Complex Step | Description |
| ------------ | ----------- |
| isPrivate | Filter for the METHOD nodes which are connected to MODIFIER nodes with the modifierType property set to PRIVATE |
| isProtected | Filter for the METHOD nodes which are connected to MODIFIER nodes with the modifierType property set to PROTECTED |
| isPublic | Filter for the METHOD nodes which are connected to MODIFIER nodes with the modifierType property set to PUBLIC |
| isStatic | Filter for the METHOD nodes which are connected to MODIFIER nodes with the modifierType property set to STATIC |
| isVirtual | Filter for the METHOD nodes which are connected to MODIFIER nodes with the modifierType property set to VIRTUAL |
| location | |

## methodRef

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| code | string | The source code construct this node represents |
| id | int | Unique node identifier |
| label | string | Returns the value of the LABEL property which represents the node type |
| lineNumber | int | First line at which the code representing this node is found |
| order | int | General ordering property for AST nodes |

Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| file | Visits | FILE nodes; in source-based Code Property Graphs, FILE nodes will point both to the actual source code files of the program under analysis and paths to the referenced files from the standard library, for IR-based Code Property Graphs, the nodes representing source code files will not exist |
| method | Visits | METHOD nodes |
| parameter | Visits | PARAMETER nodes |
| tag | Visits | TAG nodes |
| typ | Visits | TYPE nodes |

Supported Complex Steps

| Complex Step | Description |
| ------------ | ----------- |
| location | 

## methodReturn

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| code | string | The source code construct this node represents |
| id | int | Unique node identifier |
| label | string | Returns the value of the LABEL property which represents the node type |
| lineNumber | int | First line at which the code representing this node is found |
| order | int | General ordering property for AST nodes |

Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| file | Visits FILE nodes; in source-based Code Property Graphs, FILE nodes will point both to the actual source code files of the program under analysis and paths to the referenced files from the standard library, for IR-based Code Property Graphs, the nodes representing source code files will not exist |
| method | Visits METHOD nodes |
| tag | Visits TAG nodes |
| typ | Visits TYPE nodes |

Supported Complex Steps

| Complex Step | Description |
| ------------ | ----------- |
| location | |

## modifier

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| id | int | Unique node identifier |
| label | string | Returns the value of the LABEL property which represents the node type |
| order | int | General ordering property for AST nodes |

Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| file | Visits FILE nodes; in source-based Code Property Graphs, FILE nodes will point both to the actual source code files of the program under analysis and paths to the referenced files from the standard library, for IR-based Code Property Graphs, the nodes representing source code files will not exist |
| tag | Visits TAG nodes |

Supported Complex Steps

| Complex Step | Description |
| ------------ | ----------- |
| location | |

## namespaceBlock

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| id | int | Unique node identifier |
| fullName | string | General string identifier which includes various details of the node it is defined on |
| label | string | Returns the value of the LABEL property which represents the node type |
| name | string | General string identifier for various nodes |
| order | int | General ordering property for AST nodes |

Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| file | Visits FILE nodes; in source-based Code Property Graphs, FILE nodes will point both to the actual source code files of the program under analysis and paths to the referenced files from the standard library, for IR-based Code Property Graphs, the nodes representing source code files will not exist |
| tag | Visits TAG nodes |
| typeDecl | Visits TYPE_DECL nodes |

Supported Complex Steps

| Complex Step | Description |
| ------------ | ----------- |
| location | |

## namespace

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| id | int | Unique node identifier |
| label | string | Returns the value of the LABEL property which represents the node type |
| name | string | General string identifier for various nodes |
| order | int | General ordering property for AST nodes |

Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| file | Visits FILE nodes; in source-based Code Property Graphs, FILE nodes will point both to the actual source code files of the program under analysis and paths to the referenced files from the standard library, for IR-based Code Property Graphs, the nodes representing source code files will not exist |
| tag | Visits TAG nodes |
| typeDecl | Visits TYPE_DECL nodes |

Supported Complex Steps

| Complex Step | Description |
| ------------ | ----------- |
| location | |

## parameter

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| code | string | The source code construct this node represents |
| id | int | Unique node identifier |
| label | string | Returns the value of the LABEL property which represents the node type |
| lineNumber | int | First line at which the code representing this node is found |
| name | string | General string identifier for various nodes |
| order | int | General ordering property for AST nodes |

Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| file | Visits FILE nodes; in source-based Code Property Graphs, FILE nodes will point both to the actual source code files of the program under analysis and paths to the referenced files from the standard library, for IR-based Code Property Graphs, the nodes representing source code files will not exist |
| method | Visits METHOD nodes |
| tag | Visits TAG nodes |
| typ | Visits TYPE nodes |

Supported Complex Steps

| Complex Step | Description |
| ------------ | ----------- |
| location | |

## returns

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| code | string | The source code construct this node represents |
| id | int | Unique node identifier |
| label | string | Returns the value of the LABEL property which represents the node type |
| lineNumber | int | First line at which the code representing this node is found |
| order | int | General ordering property for AST nodes |

Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| call | Visits CALL nodes; represent call-sites |
| file | Visits FILE nodes; in source-based Code Property Graphs, FILE nodes will point both to the actual source code files of the program under analysis and paths to the referenced files from the standard library, for IR-based Code Property Graphs, the nodes representing source code files will not exist |
| method | Visits METHOD nodes |
| parameter | Visits PARAMETER nodes |
| tag | Visits TAG nodes |

Supported Complex Steps

| Complex Step | Description |
| ------------ | ----------- |
| location | |

## tag

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| id | int | Unique node identifier |
| label | string | Returns the value of the LABEL property which represents the node type |
| name | string | General string identifier for various nodes |
| value | string | Generic string value container |

Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| call | Visits CALL nodes attached to the TAG nodes |
| file | Visits FILE nodes attached to the TAG nodes |
| literal | Visits LITERAL nodes attached to the TAG nodes |
| local | Visits LOCAL nodes attached to the TAG nodes |
| method | Visits METHOD nodes attached to the TAG nodes |
| methodReturn | Visits METHOD_RETURN nodes attached to the TAG nodes |
| parameter | Visits PARAMETER nodes attached to the TAG nodes |
| tag | Visits TAG nodes attached to the TAG nodes |

Supported Complex Steps

| Complex Step | Description |
| ------------ | ----------- |
| location | |

## typeDecl

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| fullName | string | General string identifier which includes various details of the node it is defined on |
| id | int | Unique node identifier |
| isExternal | boolean | Indicates that the node represents a program construct that is not defined directly in its source code |
| label | string | Returns the value of the LABEL property which represents the node type |
| name | string | General string identifier for various nodes |
| order | int | General ordering property for AST nodes |

Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| file | Visits FILE nodes; in source-based Code Property Graphs, FILE nodes will point both to the actual source code files of the program under analysis and paths to the referenced files from the standard library, for IR-based Code Property Graphs, the nodes representing source code files will not exist |
| member | Visits MEMBER nodes; MEMBER nodes refer to members of complex types like classes or structs |
| method | Visits METHOD nodes |
| modifier | Visits MODIFIER nodes; e.g. public, private, static |
| namespace | Visits NAMESPACE nodes |
| tag | Visits TAG nodes |

Supported Complex Steps

| Complex Step | Description |
| ------------ | ----------- |
| methodBinding | |
| aliasTypeDecl | |
| aliasTypeDeclTransitive | |
| baseType | |
| baseTypeDecl | |
| baseTypeDeclTransitive | |
| derivedTypeDecl | |
| derivedTypeDeclTransitive | |
| location | |

## typ

Supported Property Directives

| Property Directive | Return Type| Description |
| ------------------ | ----------- | ----------- |
| fullName | string | General string identifier which includes various details of the node it is defined on |
| id | int | Unique node identifier |
| label | string | Returns the value of the LABEL property which represents the node type |
| name | string | General string identifier for various nodes |

Supported Node Type Steps

| Node Type Step | Description |
| -------------- | ----------- |
| file | Visits FILE nodes; in source-based Code Property Graphs, FILE nodes will point both to the actual source code files of the program under analysis and paths to the referenced files from the standard library, for IR-based Code Property Graphs, the nodes representing source code files will not exist |
| method | Visits METHOD nodes |
| member | Visits MEMBER nodes; MEMBER nodes refer to members of complex types like classes or structs |
| parameter | Visits PARAMETER nodes |
| tag | Visits TAG nodes |

Supported Complex Steps

| Complex Step | Description |
| ------------ | ----------- |
| aliasType | |
| aliasTypeDecl | |
| aliasTypeTransitive | |
| baseType | |
| baseTypeTransitive | |
| derivedType | |
| derivedTypeDecl | |
| derivedTypeTransitive | |
| location | |
| referencedTypeDecl | |
