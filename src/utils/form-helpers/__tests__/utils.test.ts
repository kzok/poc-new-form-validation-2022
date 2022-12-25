import immer from "immer";
import { describe, it, expect } from "@jest/globals";
import { initializeFormState, haveAnyErrors, isAllValid } from "../utils";
import type { FormState } from "../types";

type ExampleForm = Readonly<{
  foo: string;
  bar: string;
  baz: boolean;
}>;

const exampleForm: ExampleForm = {
  foo: "foo",
  bar: "bar",
  baz: true,
};

describe(haveAnyErrors, () => {
  it("returns false if there aren't any errors", () => {
    const formState = initializeFormState(exampleForm);
    expect(haveAnyErrors(formState)).toBe(false);
  });

  it("returns true if there are any errors", () => {
    let formState: FormState<ExampleForm>;

    formState = initializeFormState(exampleForm);
    expect(haveAnyErrors(formState)).toBe(false);

    formState = immer(formState, (draft) => {
      draft.errors = { foo: "some validation error." };
    });
    expect(haveAnyErrors(formState)).toBe(true);

    formState = immer(formState, (draft) => {
      draft.errors = { bar: "some validation error." };
    });
    expect(haveAnyErrors(formState)).toBe(true);
  });
});

describe(isAllValid, () => {
  it("returns false if there are non-touched keys", () => {
    const formState = initializeFormState(exampleForm);
    expect(isAllValid(formState)).toBe(false);
  });

  it("returns false if there are validation errors", () => {
    const formState = immer(initializeFormState(exampleForm), (draft) => {
      draft.touches["foo"] = true;
      draft.errors["foo"] = "some validation error.";
    });
    expect(isAllValid(formState)).toBe(false);
  });

  it("returns true if every key is touched and no validation errors exist", () => {
    const formState = immer(initializeFormState(exampleForm), (draft) => {
      draft.touches = { foo: true, bar: true, baz: true };
    });
    expect(isAllValid(formState)).toBe(true);
  });
});

describe(initializeFormState, () => {
  it("creates form state", () => {
    const formState = initializeFormState(exampleForm);
    expect(formState.initials).toEqual(exampleForm);
    expect(formState.values).toEqual(exampleForm);
  });
});
