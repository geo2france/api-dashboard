module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  //setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testMatch: ['**/?(*.)+(test).(ts|tsx)'],
  moduleNameMapper: {
    '\\.svg\\?react$': '<rootDir>/__mocks__/svgReact.tsx', // Mock pour le composant SVG
    '\\.svg\\?url$': '<rootDir>/__mocks__/svgUrl.tsx',     // Mock pour l'URL de l'image SVG
    "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.tsx", // Mock por les CSS
  },
};