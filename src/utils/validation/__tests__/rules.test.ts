import { create, stringRules } from "../string-rules";
import { describe, it, expect } from "@jest/globals";
import { pass, fail } from "../utils";

describe("create string rule", () => {
  const rule = create((value) => {
    return value === "foo" ? pass() : fail("value isn't foo!");
  });

  it("creates string validation rule", () => {
    expect(rule({})("foo")).toStrictEqual(pass());
    expect(rule({})("")).toStrictEqual(fail("value isn't foo!"));
  });

  it("can overwrites validation error message", () => {
    expect(rule({ message: "error" })("foo")).toStrictEqual(pass());
    expect(rule({ message: "error" })("")).toStrictEqual(fail("error"));
  });
});

describe("required", () => {
  const rule = stringRules.required({});

  it("fails if empty string is passed", () => {
    expect(rule("")).toStrictEqual(fail("必須項目です。"));
  });

  it("passes if empty string is NOT passed", () => {
    expect(rule("foo")).toStrictEqual(pass());
    expect(rule("bar")).toStrictEqual(pass());
  });
});

describe("number", () => {
  const rule = stringRules.number({});

  it("accepts empty string", () => {
    expect(rule("")).toStrictEqual(pass());
  });

  it("fails if non-numerical string is passed", () => {
    expect(rule("foo")).toStrictEqual(fail("数字で入力してください。"));
    expect(rule("0x01")).toStrictEqual(fail("数字で入力してください。"));
    expect(rule("1e3")).toStrictEqual(fail("数字で入力してください。"));
  });

  it("passes if numerical string is passed", () => {
    expect(rule("0")).toStrictEqual(pass());
    expect(rule("123456789")).toStrictEqual(pass());
  });
});

describe("fixed length", () => {
  const rule = stringRules.length({ size: 3 });

  it("accepts empty string", () => {
    expect(rule("")).toStrictEqual(pass());
  });

  it("fails if string length is NOT match", () => {
    expect(rule("fo")).toStrictEqual(fail("3文字で入力してください。"));
    expect(rule("foo")).toStrictEqual(pass());
    expect(rule("fooo")).toStrictEqual(fail("3文字で入力してください。"));
  });
});

describe("max length", () => {
  const rule = stringRules.maxLength({ size: 3 });

  it("accepts empty string", () => {
    expect(rule("")).toStrictEqual(pass());
  });

  it("fails if string length exceeds the size", () => {
    expect(rule("fo")).toStrictEqual(pass());
    expect(rule("foo")).toStrictEqual(pass());
    expect(rule("fooo")).toStrictEqual(fail("3文字以下で入力してください。"));
  });
});

describe("integer", () => {
  const rule = stringRules.integer({});
  const message = "整数で入力してください。";

  it("accepts empty string", () => {
    expect(rule("")).toStrictEqual(pass());
  });

  it("fails if string is NOT integer", () => {
    expect(rule("foo")).toStrictEqual(fail(message));
    expect(rule("0x01")).toStrictEqual(fail(message));
    expect(rule("1e3")).toStrictEqual(fail(message));
  });

  it("passed if string is integer", () => {
    expect(rule("10")).toStrictEqual(pass());
    expect(rule("100")).toStrictEqual(pass());
    expect(rule("1000")).toStrictEqual(pass());
    expect(rule("10000")).toStrictEqual(pass());
  });
});

describe("integer greater than", () => {
  const rule = stringRules.integerGt({ target: "1000" });

  it("accepts empty string", () => {
    expect(rule("")).toStrictEqual(pass());
  });

  it("fails if string is NOT integer", () => {
    expect(rule("foo")).toStrictEqual(
      fail("1000以上の整数で入力してください。")
    );
    expect(rule("0x01")).toStrictEqual(
      fail("1000以上の整数で入力してください。")
    );
    expect(rule("1e3")).toStrictEqual(
      fail("1000以上の整数で入力してください。")
    );
  });

  it("fails if integer string exceeds the target", () => {
    expect(rule("1000")).toStrictEqual(
      fail("1000以上の整数で入力してください。")
    );
    expect(rule("1001")).toStrictEqual(pass());
  });

  it("any string passes if target option isn't integer", () => {
    const customizedRule = stringRules.integerGt({ target: "non-integer" });
    expect(customizedRule("foo")).toStrictEqual(pass());
    expect(customizedRule("1000")).toStrictEqual(pass());
    expect(customizedRule("1001")).toStrictEqual(pass());
  });
});