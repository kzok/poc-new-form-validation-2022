import { AnyObject, State, Touches } from "./types";

/**
 * @param formState
 * @returns whether there are any validation errors
 */
export const haveAnyErrors = (formState: State<AnyObject>): boolean => {
  for (const key of Object.keys(formState.errors)) {
    if (formState.errors[key] != null) {
      return true;
    }
  }
  return false;
};

/**
 * @param formState
 * @returns whether every key is touched and has no errors
 */
export const isAllValid = (formState: State<AnyObject>): boolean => {
  if (formState.touches !== true) {
    return false;
  }
  for (const key of Object.keys(formState.errors)) {
    if (formState.errors[key] != null) {
      return false;
    }
  }
  return true;
};

/**
 * @param formState
 * @returns whether current form value is modified
 */
export const isModified = (formState: State<AnyObject>): boolean => {
  const initials: { readonly [_: string]: unknown } = formState.initials;
  const values: { readonly [_: string]: unknown } = formState.values;
  for (const key of Object.keys(initials)) {
    if (initials[key] !== values[key]) {
      return true;
    }
  }
  return false;
};

/**
 * @param initials initial values
 * @returns form state
 */
export const initializeState = <Form extends AnyObject>(
  initials: Form
): State<Form> => ({
  initials,
  values: initials,
  touches: {},
  errors: {},
});

/**
 * @param touches formState.touches
 * @param key key of validation
 * @returns updated touches
 */
export const touchKey = <Key extends string>(
  touches: Touches<Key>,
  key: Key
): Touches<Key> => {
  if (touches === true) {
    return touches;
  }
  return { ...touches, [key]: true };
};
