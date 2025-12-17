# Test Architecture Overview

This page is predominantly so I can draw the user's attention to some cool features of the test suite.

# Features

## Pre-Authentication / Test Users

**What**
* A TestUser class implemented within a TestUsers object available to each test
* Before running any tests, pre-authenticate all TestUsers

**Why**
* Per environment, we can define multiple different users who have been set up in various states. We're talking localisation, timezones, user private data etc. Provided our tests do proper cleanup to ensure the TestUsers are always in a known state, this means we can do a single setup step (per environment) and then re-check complicated scenarios whenever we want (without having to set them up again!) 
* By pre-authenticating before we run all tests, we can shortcut having to do re-logs during tests. This is a significant time-save when the test suite grows large.

**Example files**
* testUsers.ts
* globalSetup.ts
* steps/loginSteps.ts

## i18n

**What**
* Allow DOM elements to be selected by localised strings served by i18n
* Allow tests to access localised strings for assertions

**Why**
* There's a Playwright best practice around ensuring the website is used "how the user uses it". That includes clicking on buttons based on what information the user can read, rather than using selectors. I'm still on the fence here. CSS Selector still feels much safer. However, I've figured out a way to make this work, so I've interspersed it into this project.
* Sometimes it's crucial to make sure that an "internal" error or edge case is being correctly translated into a warning message for the user. It's one thing to assert that there are 0 elements of a given type on a page, but something completely different to verify that the user is being told why. And in these cases, we also need to verify that the user is being told why in their own language.

**Example files**
* i18n/
* components/cart.ts
* tests/products.spec.ts (test name - *Informative message shown when there are no valid products*)

## Target environment selection

**What**
* Helper mechanism for running tests against any named environment
* Support for environment files being stored outside of source control

**Why**
* A single image of the test suite can be built via a single mechanism and then pointed at any environment
* Sensitive data can be properly looked after(!)

**Example files**
* settings/
* runTests.ts
* playwright.config.ts

For this example, I've committed the .env files to source control, only to show how these files should look. Usually, these should be constructed by CI/CD pipelines pulling secrets from secure stores.

## Test Steps & Step Decorators

**What**
* Structuring tests into Arrange/Act/Assert, further broken down into descriptive test steps
* Allowing a re-usable set of steps used in many tests to be given it's own decorator

**Why**
* Test steps appear in both Playwright's UI mode and the traces it produces on failure. By describing each action in plain English, not only is the codebase really easy to follow, test failures are also much easier to drill down into.
* If an issue happens during a long setup step for a test, you want to quickly identify that it's happening in shared code. By using decorators, we can make these steps extra conspicuous when looking at failed tests.

**Example files**
* tests/
* playwright/decorators.ts
