module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  modulePathIgnorePatterns: ['<rootDir>/lib/', '<rootDir>/dist/'],
  moduleDirectories: ['node_modules', 'tests'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx,ts,tsx}',
    '!**/demos/**',
    '!**/tests/**',
    '!**/.umi/**',
  ],
}
