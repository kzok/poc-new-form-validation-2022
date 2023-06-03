export type AnyObject = Record<string, unknown>;

/**
 * whether form key is touched by form key
 * @note "true" means all keys are touched
 */
export type Touches<Key extends string> =
  | true
  | {
      readonly [_ in Key]?: true | undefined;
    };

/** validation error message by form key */
export type Errors<Key extends string> = {
  readonly [_ in Key]?: string | undefined;
};

/** @typeParam Values - form values */
export type State<Values extends AnyObject> = Readonly<{
  /** initial form values */
  initials: Readonly<Values>;
  /** current form values */
  values: Readonly<Values>;
  /**
   * touched state by key
   * @note "true" means all keys are touched
   */
  touches: Touches<keyof Values & string>;
  /** validation errors by key */
  errors: Errors<keyof Values & string>;
}>;

/** @typeParam Values - form values */
export type Validator<Values extends AnyObject> = Readonly<{
  /**
   * @param formState current form state
   * @returns form errors
   */
  generateErrors: (
    formState: Pick<State<Values>, "values" | "touches">
  ) => State<Values>["errors"];
  /**
   * touches all keys and validate all values
   * @param formState current form state
   * @returns [whether or not the validation passed, next form state]
   */
  validateAll: (
    formState: Pick<State<Values>, "initials" | "values">
  ) => [boolean, State<Values>];
}>;
