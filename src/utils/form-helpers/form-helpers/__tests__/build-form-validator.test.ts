import { stringRules } from "../../validation";
import { initializeState, touchKey } from "../utils";
import { buildFormValidator } from "../build-form-validator";
import { describe, it, expect } from "@jest/globals";
import { State } from "../types";
import immer from "immer";

type ExampleForm = Readonly<{
  enable: boolean;
  min: string;
  max: string;
}>;

const exampleFormState = initializeState<ExampleForm>({
  enable: false,
  min: "",
  max: "",
});

const { generateErrors, validateAll } = buildFormValidator<ExampleForm>(
  (config) => {
    // validation rules activated only if enable is true
    if (config.values.enable) {
      config.add("min", [stringRules.required({}), stringRules.integer({})]);
      config.add("max", [
        stringRules.required({}),
        stringRules.integer({}),
        stringRules.integerGt({ target: config.values.min }),
      ]);
    }
  }
);

describe(generateErrors, () => {
  it("ignores values that aren't touched yet", () => {
    let formState: State<ExampleForm> = exampleFormState;
    expect(generateErrors(formState)).toStrictEqual({});
    formState = immer(formState, (draft) => {
      draft.values.enable = true;
    });
    expect(generateErrors(formState)).toStrictEqual({});
  });

  it("generates errors for values that are touched", () => {
    let formState: State<ExampleForm> = exampleFormState;
    formState = immer(formState, (draft) => {
      draft.values.enable = true;
      draft.touches = touchKey(draft.touches, "enable");
    });
    expect(generateErrors(formState)).toStrictEqual({});
    formState = immer(formState, (draft) => {
      draft.touches = touchKey(draft.touches, "min");
    });
    expect(generateErrors(formState)).toStrictEqual({
      min: "必須項目です。",
    });
    formState = immer(formState, (draft) => {
      draft.touches = touchKey(draft.touches, "max");
    });
    expect(generateErrors(formState)).toStrictEqual({
      min: "必須項目です。",
      max: "必須項目です。",
    });
  });

  it("clear validation errors that are already resolved", () => {
    let formState: State<ExampleForm> = exampleFormState;
    formState = immer(formState, (draft) => {
      draft.values.enable = true;
      draft.touches = touchKey(draft.touches, "enable");
      draft.touches = touchKey(draft.touches, "min");
      draft.touches = touchKey(draft.touches, "max");
    });
    expect(generateErrors(formState)).toStrictEqual({
      min: "必須項目です。",
      max: "必須項目です。",
    });
    formState = immer(formState, (draft) => {
      draft.values.min = "0";
    });
    expect(generateErrors(formState)).toStrictEqual({
      max: "必須項目です。",
    });
    formState = immer(formState, (draft) => {
      draft.values.max = "1";
    });
    expect(generateErrors(formState)).toStrictEqual({});
  });

  it("works with conditional valudation rules", () => {
    let formState: State<ExampleForm> = exampleFormState;
    formState = immer(formState, (draft) => {
      draft.values.enable = true;
      draft.touches = touchKey(draft.touches, "enable");
      draft.values.min = "0";
      draft.touches = touchKey(draft.touches, "min");
      draft.values.max = "1";
      draft.touches = touchKey(draft.touches, "max");
    });
    expect(generateErrors(formState)).toStrictEqual({});
    formState = immer(formState, (draft) => {
      draft.values.min = "100";
    });
    expect(generateErrors(formState)).toStrictEqual({
      max: "100以上の整数で入力してください。",
    });
  });
});

describe(validateAll, () => {
  it("touches all key and update validation errors", () => {
    let formState: State<ExampleForm> = exampleFormState;
    let passed: boolean;
    [passed, formState] = validateAll(formState);
    expect(passed).toBe(true);
    expect(formState.touches).toBe(true);
    expect(formState.errors).toStrictEqual({});
    [passed, formState] = validateAll(
      immer(formState, (draft) => {
        draft.values.enable = true;
      })
    );
    expect(passed).toBe(false);
    expect(formState.touches).toBe(true);
    expect(formState.errors).toStrictEqual({
      max: "必須項目です。",
      min: "必須項目です。",
    });
  });
});
