/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "\\.(css|module\\.css)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg|webp)$": "<rootDir>/__mocks__/fileMock.js",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        diagnostics: false,
        tsconfig: {
          jsx: "react-jsx",
        },
      },
    ],
  },
  // Permite que Jest transforme paquetes ESM de node_modules
  transformIgnorePatterns: ["node_modules/(?!(react-icons|@testing-library)/)"],
  roots: ["<rootDir>/src"],
  collectCoverage: true,
  coverageReporters: ["text", "lcov"],
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
};

module.exports = config;
