module.exports = {
    preset: 'ts-jest',
    testMatch: ['**/*.test.ts'],
    moduleNameMapper: {
        '@/(.*)': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/jest.setup.ts'],
};