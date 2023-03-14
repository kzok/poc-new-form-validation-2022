import type * as validation from "../validation";
import type { AnyObject, Validator } from "./types";

type AcceptableRule<Value> =
  | validation.ValidationResult
  | validation.Validator<Value>;

export type ValidatorConfig<Form extends AnyObject> = (
  config: Readonly<{
    /** current form values */
    values: Readonly<Form>;
    /**
     * Add validation rule
     * @param key form key
     * @param rules validation rules or results
     */
    add: <Key extends keyof Form>(
      key: Key,
      rules: AcceptableRule<Form[Key]>[]
    ) => void;
  }>
) => void;

/**
 * @param value form value
 * @param rules validation rules
 * @returns validation error or null
 */
const validateValue = <Value>(
  value: Value,
  rules: readonly AcceptableRule<Value>[]
): string | null => {
  for (const rule of rules) {
    const result = typeof rule === "function" ? rule(value) : rule;
    if (result.status === "failed") {
      return result.message;
    }
  }
  return null;
};

/**
 * @param configure
 * @returns form validator
 */
export const buildFormValidator = <Form extends AnyObject>(
  configure: ValidatorConfig<Form>
): Validator<Form> => {
  return ({ values, touches }) => {
    // create map of validation rules by form key
    const rulesByKey: { [K in keyof Form]?: AcceptableRule<Form[K]>[] } = {};
    configure({
      values,
      add: (key, params) => {
        const rules = rulesByKey[key] ?? [];
        rules.push(...params);
        rulesByKey[key] = rules;
      },
    });

    // generates form errors
    const errors: Record<string, string | undefined> = {};
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        // ignore non-touched key
        if (touches[key] !== true) {
          continue;
        }
        const rules = rulesByKey[key];
        if (rules == null) {
          continue;
        }
        const error = validateValue(values[key], rules);
        if (error != null) {
          errors[key] = error;
        }
      }
    }
    return errors;
  };
};
