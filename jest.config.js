module.exports = {
    preset: 'ts-jest',
    testEnvironment: './default-test-environment.ts',
    testMatch: ['**/*.test.ts'],
    moduleNameMapper: {
        '@/(.*)': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

};