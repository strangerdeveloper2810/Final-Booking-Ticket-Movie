module.exports = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@cinefix/types$": "<rootDir>/packages/types/src",
    "^@cinefix/utils$": "<rootDir>/packages/utils/src",
    "^@cinefix/locales$": "<rootDir>/packages/locales/src",
    "^@cinefix/api-client$": "<rootDir>/packages/api-client/src",
    "^@cinefix/realtime$": "<rootDir>/packages/realtime/src",
    "^@cinefix/ui$": "<rootDir>/packages/ui/src",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/__mocks__/fileMock.ts",
    "\\.(css|less)$": "<rootDir>/src/__mocks__/styleMock.ts",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleDirectories: ["node_modules", "src"],
  modulePathIgnorePatterns: ["<rootDir>/.claude"],
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/vendor/**",
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
