import { Validator, ValidationResult } from "./types";
import { pass, fail } from "./utils";

/** factory function returning validator */
type ValidatorFactory<Options extends Record<string, unknown>> = (
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
const create =
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

/** predefined validation rules */
export const rules = {
  /** non-empty string */
  required: create((value) => {
    if (value === "") {
      return fail("必須項目です。");
    }
    return pass();
  }),
  /** number */
  number: create((value) => {
    if (value === "" || /^\d+$/.exec(value) != null) {
      return pass();
    }
    return fail("数字で入力してください。");
  }),
  /** fixed character count */
  length: create<{
    /** text size */
    size: number;
  }>((value, { size }) => {
    // consider surrogate pairs
    if (value === "" || Array.from(value).length === size) {
      return pass();
    }
    return fail(`${size}文字で入力してください。`);
  }),
  /** max character count */
  maxLength: create<{
    /** text size */
    size: number;
  }>((value, { size }) => {
    // consider surrogate pairs
    if (value === "" || Array.from(value).length <= size) {
      return pass();
    }
    return fail(`${size}文字以下で入力してください。`);
  }),
  /** integer */
  int: create((value) => {
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
  intGt: create<{
    /** compared to */
    target: string;
  }>((value, { target }) => {
    if (value === "") {
      return pass();
    }
    const targetInt = toBigInt(target);
    if (targetInt == null) {
      return pass(); // skip validation if option is invalid
    }
    const valueInt = toBigInt(value);
    if (valueInt != null && targetInt < valueInt) {
      return pass();
    }
    return fail(`${target}以上の整数で入力してください。`);
  }),
} as const;
