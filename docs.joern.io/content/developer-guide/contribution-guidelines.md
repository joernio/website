---
id: contributing
title: Contributing to Joern
weight: 10
---

Thank you for taking time to contribute to Joern! Here are a few guidelines to ensure your pull
request will get merged as soon as possible.

### Creating a Pull Request

Try to make use of the templates as far as possible, however they may not suit all needs. The
  minimum we would like to see is:
- A title that briefly describes the change and purpose of the PR, preferably with the affected
    module in square brackets, e.g. `[javasrc] Addition Operator Fix`.
- A short description of the changes in the body of the PR. This could be in bullet points or
    paragraphs.
- A link or reference to the related issue, if any exists.

### Dos and Don'ts

Do not:
- Immediately CC/@/email spam other contributors, the team will review the PR and assign the most
    appropriate contributor to review the PR. Joern is maintained by industry partners and
    researchers alike, for the most part with their own goals and priorities, and additional help is
    largely volunteer work. If your PR is going stale, then reach out to us in follow-up comments
    with @'s asking for an explanation of priority or planning of when it may be addressed (if ever,
    depending on quality).
- Leave the description body empty, this makes reviewing the purpose of the PR difficult.

Do remember to:
- Remember to format your code, i.e. run `sbt scalafmt Test/scalafmt`
- Add a unit test to verify your change.