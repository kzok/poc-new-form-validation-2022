import { AnyObject, State, Touches } from "./types";

/**
 * @param formState
 * @returns whether there are any validation errors
 */
export const haveAnyErrors = (formState: State<AnyObject>): boolean => {
  return Object.values(formState.errors).some((error) => error != null);
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
