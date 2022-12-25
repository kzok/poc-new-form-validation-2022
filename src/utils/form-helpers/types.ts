export type AnyObject = Record<string, unknown>;

/** whether form key is touched by form key */
export type FormTouches = { readonly [_: string]: true | undefined };

/** validation error message by form key */
export type FormErrors = { readonly [_: string]: string | undefined };

/** form state for state management */
export type FormState<Form extends AnyObject> = Readonly<{
  /** initial input values */
  initials: Readonly<Form>;
  /** current input values */
  values: Readonly<Form>;
  /** touched state by key */
  touches: FormTouches;
  /** validation errors by key */
  errors: FormErrors;
}>;
