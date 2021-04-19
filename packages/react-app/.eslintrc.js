module.exports = {
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['react', '@typescript-eslint', 'jest'],
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': 'off',
    "no-underscore-dangle": "off",
    "@typescript-eslint/ban-ts-ignore": "off", // TODO off with description
    "@typescript-eslint/ban-ts-comment": "off",
    "no-console": "off",
    "import/prefer-default-export": "off",
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "react/static-property-placement": "off",
    "react/destructuring-assignment": "off",
    "react/jsx-props-no-spreading": "off",
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
