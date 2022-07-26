export default {
  modulePathIgnorePatterns: ['<rootDir>/dist', '<rootDir>/__tests__/example.*'],
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^(\\..*)\\.jsx?$': '$1', // support for ts imports with .js extensions
  },
  extensionsToTreatAsEsm: ['.ts'],
};
