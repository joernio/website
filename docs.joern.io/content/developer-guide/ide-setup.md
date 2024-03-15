---
id: ide-setup
title: Setting Up Your IDE
weight: 30
---

#### IntelliJ IDEA
* [Download IntelliJ Community](https://www.jetbrains.com/idea/download)
* Install and run it
* Install the [Scala Plugin](https://plugins.jetbrains.com/plugin/1347-scala) - just search and
  install from within IntelliJ.
* Important: open `sbt` in your local joern repository, run `compile` and keep it open - this will
  allow us to use the BSP build in the next step
* Back to IntelliJ: open project: select your local joern clone: select to open as `BSP Project`
  (i.e. _not_ `sbt project`!)
* Await the import and indexing to complete, then you can start, e.g. `Build -> Build project` or
  run a test

Pro tip: Scala 3 support is limited and opting for Nightly builds is highly recommended.

#### VSCode
- Install VSCode and Docker
- Install the plugin `ms-vscode-remote.remote-containers`
- Open Joern project folder in
  [VSCode](https://docs.microsoft.com/en-us/azure-sphere/app-development/container-build-vscode#build-and-debug-the-project)
  Visual Studio Code detects the new files and opens a message box saying: `Folder contains a Dev
  Container configuration file. Reopen to folder to develop in a container.`
- Select the `Reopen in Container` button to reopen the folder in the container created by the
  `.devcontainer/Dockerfile` file
- Switch to `scalameta.metals` sidebar in VSCode, and select `import build` in `BUILD COMMANDS`
- After `import build` succeeds, you are ready to start writing code for Joern
