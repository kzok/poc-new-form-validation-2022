import type { Validator, ValidationResult } from "./types";
import { pass, fail } from "./utils";

/** factory function returning validator */
type ValidatorFactory<in out Options extends Record<string, unknown>> = (
  options: Readonly<Options>
) => Validator;

/** basic options for createRule() */
type BasicOptions = Readonly<{
  /** validation message (string or factory) */
  message?: string | ((value: string) => string) | undefined;
}>;

/**
 * @param factory validator factory
 * @returns
 */
export const createStringRule =
  <Options extends Record<string, unknown> = Record<never, unknown>>(
    rule: (value: string, options: Options) => ValidationResult
  ): ValidatorFactory<Options & BasicOptions> =>
  (options) =>
  (value) => {
    const result = rule(value, options);
    const { message } = options;
    if (message == null || result.status === "passed") {
      return result;
    }
    return fail(typeof message === "function" ? message(value) : message);
  };

const toBigInt = (s: string): bigint | null => {
  try {
    if (/^\d+$/.exec(s) == null) {
      return null;
    }
    return BigInt(s);
  } catch {
    return null;
  }
};

/** shared validation rules */
export const rules = {
  /** non-empty string */
  required: createStringRule((value) => {
    if (value === "") {
      return fail("必須項目です。");
    }
    return pass();
  }),
  /** number */
  number: createStringRule((value) => {
    if (value === "" || /^\d+$/.exec(value) != null) {
      return pass();
    }
    return fail("数字で入力してください。");
  }),
  /** fixed character count */
  length: createStringRule<{ size: number }>((value, { size }) => {
    // consider surrogate pairs
    if (value === "" || Array.from(value).length === size) {
      return pass();
    }
    return fail(`${size}文字で入力してください。`);
  }),
  /** max character count */
  maxLength: createStringRule<{ size: number }>((value, { size }) => {
    // consider surrogate pairs
    if (value === "" || Array.from(value).length <= size) {
      return pass();
    }
    return fail(`${size}文字以下で入力してください。`);
  }),
  /** integer */
  integer: createStringRule((value) => {
    if (value === "") {
      return pass();
    }
    const valueInt = toBigInt(value);
    if (valueInt == null) {
      return fail(`整数で入力してください。`);
    }
    return pass();
  }),
  /** integer greater than */
  integerGt: createStringRule<{ rValue: string }>((value, { rValue }) => {
    if (value === "") {
      return pass();
    }
    const targetInt = toBigInt(rValue);
    if (targetInt == null) {
      return pass(); // skip validation if option is invalid
    }
    const valueInt = toBigInt(value);
    if (valueInt != null && targetInt < valueInt) {
      return pass();
    }
    return fail(`${rValue}以上の整数で入力してください。`);
  }),
} as const;
