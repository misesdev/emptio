import { JestConfigWithTsJest } from "ts-jest"

const jestConfig: JestConfigWithTsJest  = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ['<rootDir>'],
}

export default jestConfig
