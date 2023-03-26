import { stringRules } from "../../validation";
import { initializeState } from "../utils";
import { buildFormValidator } from "../build-form-validator";
import { describe, it, expect } from "@jest/globals";
import { State } from "../types";
import immer from "immer";

describe("example scenario #1", () => {
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

  const validateForm = buildFormValidator<ExampleForm>((config) => {
    // validation rules activated only if enable is true
    if (config.values.enable) {
      config.add("min", [stringRules.required({}), stringRules.integer({})]);
      config.add("max", [
        stringRules.required({}),
        stringRules.integer({}),
        stringRules.integerGt({ target: config.values.min }),
      ]);
    }
  });

  it("form validator works as intended", () => {
    let formState: State<ExampleForm> = exampleFormState;

    formState = immer(exampleFormState, (draft) => {
      draft.touches = true;
    });
    expect(validateForm(formState)).toStrictEqual({});

    formState = immer(formState, (draft) => {
      draft.values.enable = true;
    });
    expect(validateForm(formState)).toStrictEqual({
      min: "必須項目です。",
      max: "必須項目です。",
    });

    formState = immer(formState, (draft) => {
      draft.values.min = "0";
    });
    expect(validateForm(formState)).toStrictEqual({ max: "必須項目です。" });

    formState = immer(formState, (draft) => {
      draft.values.max = "1";
    });
    expect(validateForm(formState)).toStrictEqual({});

    formState = immer(formState, (draft) => {
      draft.values.min = "100";
    });
    expect(validateForm(formState)).toStrictEqual({
      max: "100以上の整数で入力してください。",
    });
  });
});
