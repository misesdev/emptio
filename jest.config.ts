import { JestConfigWithTsJest } from "ts-jest"

const jestConfig: JestConfigWithTsJest  = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ['<rootDir>'],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: {
        "^@components/(.*)$": "<rootDir>/src/components/$1",
        "^@services/(.*)$": "<rootDir>/src/services/$1",
        "^@src/(.*)$": "<rootDir>/src/$1",
        "^@assets/(.*)$": "<rootDir>/assets/$1",
    }
}

export default jestConfig
