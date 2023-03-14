import immer from "immer";
import { describe, it, expect } from "@jest/globals";
import { initializeState, haveAnyErrors, isAllValid } from "../utils";
import { State } from "../types";

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
    const formState = initializeState(exampleForm);
    expect(haveAnyErrors(formState)).toBe(false);
  });

  it("returns true if there are any errors", () => {
    let formState: State<ExampleForm>;

    formState = initializeState(exampleForm);
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
    const formState = initializeState(exampleForm);
    expect(isAllValid(formState)).toBe(false);
  });

  it("returns false if there are validation errors", () => {
    const formState = immer(initializeState(exampleForm), (draft) => {
      draft.touches["foo"] = true;
      draft.errors["foo"] = "some validation error.";
    });
    expect(isAllValid(formState)).toBe(false);
  });

  it("returns true if every key is touched and no validation errors exist", () => {
    const formState = immer(initializeState(exampleForm), (draft) => {
      draft.touches = { foo: true, bar: true, baz: true };
    });
    expect(isAllValid(formState)).toBe(true);
  });
});

describe(initializeState, () => {
  it("creates form state", () => {
    const formState = initializeState(exampleForm);
    expect(formState.initials).toEqual(exampleForm);
    expect(formState.values).toEqual(exampleForm);
  });
});
