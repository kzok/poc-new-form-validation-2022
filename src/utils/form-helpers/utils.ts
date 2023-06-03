import { AnyObject, State, Touches } from "./types";

/**
 * @param state
 * @returns whether there are any validation errors
 */
export const haveAnyError = (
  state: Pick<State<AnyObject>, "errors">
): boolean => Object.values(state.errors).some((error) => error != null);

/**
 * @param state
 * @returns whether current form value is modified
 */
export const isModified = (
  state: Pick<State<AnyObject>, "values" | "initials">
): boolean => {
  const initials: { readonly [_: string]: unknown } = state.initials;
  const values: { readonly [_: string]: unknown } = state.values;
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
export const create = <Values extends AnyObject>(
  initials: Values
): State<Values> => ({
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
export const touch = <Key extends string>(
  touches: Touches<Key>,
  key: Key
): Touches<Key> => {
  if (touches === true) {
    return touches;
  }
  return { ...touches, [key]: true };
};
