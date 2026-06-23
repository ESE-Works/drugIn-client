require('react-native-gesture-handler/jestSetup');
import '@testing-library/jest-native/extend-expect';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => null;
  return Reanimated;
});

jest.mock('expo-constants', () => ({
  manifest: { extra: {} },
  expoConfig: { extra: {} },
}));

jest.mock('expo-router', () => {
  const actual = jest.requireActual('expo-router');
  return {
    ...actual,
    Link: (props) => props.children ?? null,
    router: {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      dismiss: jest.fn(),
      canGoBack: jest.fn(),
    },
  };
});
