module.exports = {
  root: true,
  env: {
    browser: true,
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  extends: [
    "eslint:recommended",
    "next",
    "./configs/eslint/typescript",
    "prettier",
  ],
  ignorePatterns: ["**/libs/**/*", "**/dist/**/*"],
}
