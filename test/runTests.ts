import { execSync } from "child_process";

const [enableUImode, environment] = process.argv.slice(2);

if (!environment) {
  console.error("Usage: npm run test:ui <env>");
  process.exit(1);
}

try {
  execSync(`cross-env ENVIRONMENT=${environment} node --import tsx/esm ./node_modules/@playwright/test/cli.js test`
    + `${enableUImode === 'true' ? '--ui' : ''}`, { stdio: "inherit" });
} catch (err) {
  console.error(`Failed to run tests against ${environment}`);
  process.exit(1);
}