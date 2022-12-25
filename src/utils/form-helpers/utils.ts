import type { AnyObject, FormTouches, FormState } from "./types";

/**
 * @param formState
 * @returns whether there are any validation errors
 */
export const haveAnyErrors = (formState: FormState<AnyObject>): boolean => {
  const keys: readonly string[] = Object.keys(formState.values);
  for (const key of keys) {
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
export const isAllValid = (formState: FormState<AnyObject>): boolean => {
  const keys: readonly string[] = Object.keys(formState.values);
  for (const key of keys) {
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
export const isModified = (formState: FormState<AnyObject>): boolean => {
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
export const initializeFormState = <Form extends AnyObject>(
  initials: Form
): FormState<Form> => ({
  initials,
  values: initials,
  touches: {},
  errors: {},
});

/**
 * @param formState
 * @returns
 */
export const touchAll = (formState: FormState<AnyObject>): FormTouches => {
  const touches: { [_: string]: true } = {};
  for (const key of Object.keys(formState.values)) {
    touches[key] = true;
  }
  return touches;
};
