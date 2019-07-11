module.exports = {
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/jest/styleMock.js',
    '\\.(png|jpeg|gif|ttf|eot|svg)$': '<rootDir>/jest/fileMock.js'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  collectCoverageFrom: ['src/**/*.{js,jsx}']
};
