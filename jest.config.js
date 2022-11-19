module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testEnvironment: 'node',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '<rootDir>/tests/**/*.ts'],
  coverageDirectory: 'coverage',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
};
