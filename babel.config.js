/** @type {import('@babel/core').TransformOptions} */
module.exports = {
  presets: [
    [
      "next/babel",
      {
        "preset-react": {
          runtime: "automatic",
          importSource: "@emotion/react",
        },
      },
    ],
  ],
  plugins: ["@emotion/babel-plugin"],
};
