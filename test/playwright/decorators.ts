import test from "@playwright/test";

export function step(packageName: string | null = null) {
  return function (originalMethod: Function, context: ClassMethodDecoratorContext) {
    return async function (this: any, ...args: any[]) {
      const name = `${this.constructor.name}.${String(context.name)}${packageName ? ` (${packageName})` : ""}`;
      const run = () => originalMethod.call(this, ...args);
      try {
        return await test.step(name, run);
      } catch (err: any) {
        if (err?.message?.includes("test.step() can only be called from a test")) {
          console.info(`Executing test step ${name} from package ${packageName} outside of a test context`);
          return run();
        }
        throw err;
      }
    };
  };
}
