import type { Locator } from "@playwright/test";

export abstract class ComponentBase {
  constructor(readonly host: Locator) {}
}