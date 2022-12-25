export type ValidationPassed = Readonly<{
  status: "passed";
  message?: undefined;
}>;

export type ValidationFailed = Readonly<{
  status: "failed";
  message: string;
}>;

export type ValidationResult = ValidationPassed | ValidationFailed;

/** function returning validation result */
export type Validator<in out Value = string> = (
  value: Value
) => ValidationResult;
