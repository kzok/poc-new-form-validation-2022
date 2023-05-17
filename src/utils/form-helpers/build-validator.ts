import * as validation from "../validation";
import { AnyObject, State, Validator } from "./types";
import { haveAnyError } from "./utils";

type OneOrArray<T> = T | readonly T[];
type AcceptableRule<Value> = OneOrArray<
  validation.ValidationResult | validation.Validator<Value>
>;

/** @typeParam Values - form values */
export type ValidatorConfig<Values extends AnyObject> = (
  config: Readonly<{
    /** current form values */
    values: Readonly<Values>;
    /**
     * Add validation rule
     * @param key form key
     * @param rules validation rules or results
     */
    add: <Key extends keyof Values & string>(
      key: Key,
      rules: AcceptableRule<Values[Key]>
    ) => void;
  }>
) => void;

/**
 * @typeParam Values - form values
 * @param value form value
 * @param rules validation rules
 * @returns validation error or null
 */
const validateValue = <Value>(
  value: Value,
  rules: AcceptableRule<Value>
): string | null => {
  for (const rule of Array.isArray(rules) ? rules : [rules]) {
    const result = typeof rule === "function" ? rule(value) : rule;
    if (result.status === "failed") {
      return result.message;
    }
  }
  return null;
};

/**
 * @typeParam Values - form values
 * @param configure
 * @returns form validator
 */
export const buildValidator = <Values extends AnyObject>(
  configure: ValidatorConfig<Values>
): Validator<Values> => {
  const generateErrors: Validator<Values>["generateErrors"] = ({
    values,
    touches,
  }) => {
    const errors: Partial<Record<keyof Values, string | undefined>> = {};
    configure({
      values,
      add: (key, params) => {
        // ignore non-touched key
        if (touches !== true && touches[key] !== true) {
          return;
        }
        // skip validation if there are already validation error
        if (errors[key] != null) {
          return;
        }
        const result = validateValue(values[key], params);
        if (result != null) {
          errors[key] = result;
        }
      },
    });
    return errors;
  };
  const validateAll: Validator<Values>["validateAll"] = ({
    initials,
    values,
  }) => {
    const touches = true;
    const errors = generateErrors({ values, touches });
    const passed = !haveAnyError({ errors });
    const nextState: State<Values> = { initials, values, errors, touches };
    return [passed, nextState];
  };
  return { generateErrors, validateAll };
};
