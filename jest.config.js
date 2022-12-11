/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",
  cacheDirectory: "./node_modules/.cache/jest",
  testMatch: ["**/__tests__/?(*.)test.[jt]s?(x)"],
  transform: {
    "\\.tsx?$": ["ts-jest", { tsconfig: "./tsconfig.test.json" }],
  },
};
