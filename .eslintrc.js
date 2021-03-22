module.exports = {
  extends: [
    "@cybozu/eslint-config/presets/typescript"
  ],
  plugins: ["kuc-v1"],
  rules: {
    "kuc-v1/no-underscore": "warn",
    "kuc-v1/no-handle-prefix": "error",
  }
};
