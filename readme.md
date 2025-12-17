# Overview

This repo is a demo implementation of Playwright showcasing some key concepts for end-to-end integration testing via a web UI. It performs a limited set of tests against testsmith-io's [practice-software-testing](https://github.com/testsmith-io/practice-software-testing) website.

# Running tests locally

Install the test suite by running the following commands from the ./test directory:-

1. `npm i`
2. `npx playwright install`

Tests are run with `npm run test <environment>`. The following environments are defined-

| environment | Description |
| --- | --- |
| prod | The main working website |
| staging | The buggy website |

## UI mode

Playwright's UI mode can be used to debug tests with `npm run test:ui <environment>`. This will open the Playwright UI with a test session scoped to the target environment.

## Containerised

Alternatively, the tests can be built as a docker container using `docker build -t playwright .` run from the ./test directory.

When running from inside a container, UI mode is not supported.

Once built, the test image can be run with `docker run --rm playwright <environment>`, where environment is eg. 'prod'.

# Docs

Further documentation is included in the /docs folder of this repo:-

| File | Description |
| --- | --- |
| [task-approach.md](./docs//task-approach.md) | A commentary on my approach to the task. Please read first. |
| [architecture-overview.md](./docs/architecture-overview.md) | An overview of the test architecture created as part of the task. |
| [bugs.md](./docs/bugs.md) | A list of issues I spotted in the prod website. |
