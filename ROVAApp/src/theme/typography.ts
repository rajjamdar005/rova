// ROVA Typography System
export const typography = {
  // Font families
  display: 'DM Sans',
  body: 'Geist Mono',
  ui: 'DM Sans',

  // Font sizes
  xs: 11,
  sm: 13,
  base: 15,
  lg: 18,
  xl: 24,
  '2xl': 32,
  '3xl': 48,

  // Font weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,

  // Line heights
  lineHeightBody: 1.4,
  lineHeightHeading: 1.1,

  // Letter spacing
  letterSpacingHeading: -0.02,
  letterSpacingMono: 0.04,
};

export type FontSize = keyof typeof typography;
