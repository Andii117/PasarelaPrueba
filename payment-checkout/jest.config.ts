import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  moduleNameMapper: {
    "\\.(css|module\\.css)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg|webp)$": "<rootDir>/__mocks__/fileMock.ts",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        diagnostics: false,
        tsconfig: {
          jsx: "react-jsx",
        },
        globals: {
          "import.meta": {
            env: {
              VITE_API_URL: "http://localhost:3001",
            },
          },
        },
      },
    ],
  },
  collectCoverage: true,
  coverageReporters: ["text", "lcov"],
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
};

export default config;
