module.exports = {
  env: {
    'browser': true,
    'es2021': true,
    'node': true
  },
  extends: [
    'standard-with-typescript',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier'
  ],
  plugins: [
    'react',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '(children|^_)' }],
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        'checksVoidReturn': false
      }
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/prop-types': 'off',
  },
};
