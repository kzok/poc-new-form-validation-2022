import * as validation from "../../validation";
import { initializeFormState, touchAll } from "../utils";
import { buildFormValidator } from "../build-form-validator";
import { describe, it, expect } from "@jest/globals";
import type { FormState } from "../types";
import immer from "immer";

describe("example scenario #1", () => {
  type ExampleForm = Readonly<{
    enable: boolean;
    min: string;
    max: string;
  }>;

  const exampleFormState = initializeFormState<ExampleForm>({
    enable: false,
    min: "",
    max: "",
  });

  const validateForm = buildFormValidator<ExampleForm>((config) => {
    // validation rules activated only if enable is true
    if (config.values.enable) {
      config.add("min", [
        validation.rules.required({}),
        validation.rules.integer({}),
      ]);
      config.add("max", [
        validation.rules.required({}),
        validation.rules.integer({}),
        validation.rules.integerGt({ rValue: config.values.min }),
      ]);
    }
  });

  it("form validator works as intended", () => {
    let formState: FormState<ExampleForm> = exampleFormState;

    formState = immer(exampleFormState, (draft) => {
      draft.touches = touchAll(formState);
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
