import { rules } from "../../validation";
import { create, touch } from "../utils";
import { buildValidator } from "../build-validator";
import { describe, it, expect } from "@jest/globals";
import { State } from "../types";
import immer from "immer";

type ExampleForm = Readonly<{
  enable: boolean;
  min: string;
  max: string;
}>;

const exampleFormState = create<ExampleForm>({
  enable: false,
  min: "",
  max: "",
});

const { generateErrors, validateAll } = buildValidator<ExampleForm>(
  (config) => {
    // validation rules activated only if enable is true
    if (config.values.enable) {
      config.add("min", [rules.required({}), rules.int({})]);
      config.add("max", [
        rules.required({}),
        rules.int({}),
        rules.intGt({ target: config.values.min }),
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
      draft.touches = touch(draft.touches, "enable");
    });
    expect(generateErrors(formState)).toStrictEqual({});
    formState = immer(formState, (draft) => {
      draft.touches = touch(draft.touches, "min");
    });
    expect(generateErrors(formState)).toStrictEqual({
      min: "必須項目です。",
    });
    formState = immer(formState, (draft) => {
      draft.touches = touch(draft.touches, "max");
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
      draft.touches = touch(draft.touches, "enable");
      draft.touches = touch(draft.touches, "min");
      draft.touches = touch(draft.touches, "max");
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
      draft.touches = touch(draft.touches, "enable");
      draft.values.min = "0";
      draft.touches = touch(draft.touches, "min");
      draft.values.max = "1";
      draft.touches = touch(draft.touches, "max");
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
