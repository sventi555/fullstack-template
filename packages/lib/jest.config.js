module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.cjs.json',
    },
  },
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['json-summary', 'text'],
  testMatch: ['<rootDir>/src/**/*.test.ts'],
};
