# Task Approach

I've approached this task mainly as an opportunity to showcase my understanding of Playwright and how to properly use it in an end-to-end integration test suite. I've been using Playwright since 2023 and have built my own framework / patterns based on the Page Object Model paradigms. Rather than focusing heavily on my ability to spot negative test cases (which, to be honest, I think should predominantly be covered via component-based unit testing, rather than end-to-end testing!), I've made use of the time available to cover off various technical challenges that are often faced when writing Playwright projects from scratch. I've covered these in detail in my [Architecture Overview](./architecture-overview.md).

Similarly, I've approach the bug-reporting task differently to how it was presented. I found the buggy site to be so broken that I couldn't even run my test setup routine. Nevertheless I disabled and re-ran the tests only to see every one of them fail. I included the raw test outputs (mainly playwright traces) in the `./outputs` folder in case you'd like to take a look. 

I wrote the tests against the hosted instance of the prod site. I did try to get the project running locally via docker but I found that the UI couldn't communicate properly with the API. Given this, as well as encountering many issues with the prod site during my test development, I've instead written very high-level bug reports for the issues I found with the prod site.

Issues, limitations and hacks within my test suite are documented in the codebase as comments alongside the code that gives the resultant limitation.

I decided not to work on the optional extension for API testing. I don't believe Playwright is the right tool here. In my opinion, the test tool should use the same language as the service under test. This gives us greater integration between Quality and Development teams, as well as many other benefits. Doing this means we can import DTOs directly into test frameworks. In the case where the API is written in Typescript, I don't see what benefit Playwright gives over vitest/jest together with Fetch API (or similar).
