import { AnyObject, Touches, State } from "./types";

/**
 * @param formState
 * @returns whether there are any validation errors
 */
export const haveAnyErrors = (formState: State<AnyObject>): boolean => {
  for (const key of Object.keys(formState.values)) {
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
  for (const key of Object.keys(formState.values)) {
    if (formState.touches[key] !== true || formState.errors[key] != null) {
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
 * @param formState
 * @returns
 */
export const touchAll = (formState: State<AnyObject>): Touches => {
  const touches: { [_: string]: true } = {};
  for (const key of Object.keys(formState.values)) {
    touches[key] = true;
  }
  return touches;
};
