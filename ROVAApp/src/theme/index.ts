// ROVA Design System Theme
export { colors } from './colors';
export { typography } from './typography';
export { spacing, radius } from './spacing';

export const transitions = {
  fast: 200,
  medium: 240,
  slow: 300,
};

export const theme = {
  colors: require('./colors').colors,
  typography: require('./typography').typography,
  spacing: require('./spacing').spacing,
  radius: require('./spacing').radius,
  transitions,
};

export default theme;
