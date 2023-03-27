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

/** form state for state management */
export type State<Form extends AnyObject> = Readonly<{
  /** initial input values */
  initials: Readonly<Form>;
  /** current input values */
  values: Readonly<Form>;
  /**
   * touched state by key
   * @note "true" means all keys are touched
   */
  touches: Touches<keyof Form & string>;
  /** validation errors by key */
  errors: Errors<keyof Form & string>;
}>;
