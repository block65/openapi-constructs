/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    '@block65/eslint-config/javascript',
    '@block65/eslint-config/typescript',
  ],
  parserOptions: {
    project: ['./tsconfig.json'],
  },

  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/test/*.ts'],
      rules: {
        '@typescript-eslint/no-import-type-side-effects': 'error',
        '@typescript-eslint/consistent-type-imports': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },

    {
      files: ['*.config.js', '*.config.ts', '*.workspace.ts'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
