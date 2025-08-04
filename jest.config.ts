import { JestConfigWithTsJest } from "ts-jest"

const jestConfig: JestConfigWithTsJest  = {
    preset: "ts-jest",
    testEnvironment: "node", // "node"
    roots: ['<rootDir>'],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: {
        "^@components/(.*)$": "<rootDir>/src/components/$1",
        "^@services/(.*)$": "<rootDir>/src/services/$1",
        "^@storage/(.*)$": "<rootDir>/src/storage/$1",
        "^@src/(.*)$": "<rootDir>/src/$1",
        "^@assets/(.*)$": "<rootDir>/assets/$1",
    },
    // fakeTimers: {
    //     enableGlobally: true,
    //     legacyFakeTimers: false
    // }
}

export default jestConfig
