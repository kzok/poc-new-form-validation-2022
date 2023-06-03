import immer from "immer";
import { describe, it, expect } from "@jest/globals";
import { create, haveAnyError, isModified } from "../utils";
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

describe(haveAnyError, () => {
  it("returns false if there aren't any errors", () => {
    const state = create(exampleForm);
    expect(haveAnyError(state)).toBe(false);
  });

  it("returns true if there are any errors", () => {
    let state: State<ExampleForm>;

    state = create(exampleForm);
    expect(haveAnyError(state)).toBe(false);

    state = immer(state, (draft) => {
      draft.errors = { foo: "some validation error." };
    });
    expect(haveAnyError(state)).toBe(true);

    state = immer(state, (draft) => {
      draft.errors = { bar: "some validation error." };
    });
    expect(haveAnyError(state)).toBe(true);
  });
});

describe(isModified, () => {
  it("returns false if values are same with initials", () => {
    let state: State<ExampleForm>;
    state = create(exampleForm);
    expect(isModified(state)).toBe(false);

    // values are same but has different reference
    state = immer(state, (draft) => {
      draft.values.foo = "foo";
    });
    expect(isModified(state)).toBe(false);
  });

  it("returns true if values are different from initials", () => {
    const formState = immer(create(exampleForm), (draft) => {
      draft.values.foo = "bar";
    });
    expect(isModified(formState)).toBe(true);
  });
});

describe(create, () => {
  it("creates form state", () => {
    const formState = create(exampleForm);
    expect(formState.initials).toEqual(exampleForm);
    expect(formState.values).toEqual(exampleForm);
  });
});
