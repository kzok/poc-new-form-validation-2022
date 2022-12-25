import type { ValidationResult } from "./types";

const passedResult: ValidationResult = { status: "passed" };

export const pass = (): ValidationResult => passedResult;

export const fail = (message: string): ValidationResult => ({
  status: "failed",
  message,
});
