---
title: "Integrate Joern in your project. REST APIs are there for you 🤝"
layout: "blog"
url: "integrate"
---
So, you have your own DIY code analysis tool with a swanky UI, but you also fell in love with Joern? We understand that!

## Get Joern
{{< highlight html >}}
$ curl -L https://github.com/joernio/joern/releases/latest/download/joern-install.sh | sudo bash
{{< /highlight >}}

## Start the Joern Server
{{< highlight html >}}
$ joern --server
{{< /highlight >}}
Yep! It's that easy!

## Integrate queries into your code

Let's get the Python CPG Query Language client library so we can test some integrations with Python. Don't worry. We also have a JavaScript integration for your gloriously hipster JS UI!
{{< highlight html >}}
$ pip install cpgqls-client
{{< /highlight >}}
Fire up some queries in your Python client!
{{< highlight html >}}
from cpgqls_client import CPGQLSClient, import_code_query

server_endpoint = "localhost:8080"
client = CPGQLSClient(server_endpoint)

query = import_code_query("/home/suchakra/Projects/test.jar", "test-app")    
result = client.execute(query)
print(result['stdout'])

# execute a simple CPG query to list all methods in the code
query = "cpg.method.name.l"
result = client.execute(query)
print(result)
{{< /highlight >}}

That's it! For additional information, check out the [Server documentation](https://docs.joern.io/server/) or get a closer look at the [Python client library](https://github.com/joernio/cpgqls-client-python) 👈

