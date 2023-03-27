import * as validation from "../validation";
import { AnyObject, State } from "./types";

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
    add: <Key extends keyof Form & string>(
      key: Key,
      rules: readonly AcceptableRule<Form[Key]>[]
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

export type Validator<Form extends AnyObject> = Readonly<{
  /**
   * @param formState current form state
   * @returns form errors
   */
  generateErrors: (
    formState: Pick<State<Form>, "values" | "touches">
  ) => State<Form>["errors"];
  /**
   * touches all keys and validate all values
   * @param formState current form state
   * @returns [whether or not the validation passed, next form state]
   */
  validateAll: (
    formState: Pick<State<Form>, "initials" | "values">
  ) => [boolean, State<Form>];
}>;

/**
 * @param configure
 * @returns form validator
 */
export const buildFormValidator = <Form extends AnyObject>(
  configure: ValidatorConfig<Form>
): Validator<Form> => {
  const generateErrors: Validator<Form>["generateErrors"] = ({
    values,
    touches,
  }) => {
    const errors: Partial<Record<keyof Form, string | undefined>> = {};
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
  const validateAll: Validator<Form>["validateAll"] = ({
    initials,
    values,
  }) => {
    const touches = true;
    const errors = generateErrors({ values, touches });
    const passed = Object.values(errors).every((error) => error == null);
    const nextState: State<Form> = { initials, values, errors, touches };
    return [passed, nextState];
  };
  return { generateErrors, validateAll };
};
