// ROVA Spacing System (4px base grid)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,

  // Semantic spacing
  cardPadding: 16,
  sectionPaddingHorizontal: 24,
  sectionPaddingVertical: 32,
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
};

export type SpacingKey = keyof typeof spacing;
export type RadiusKey = keyof typeof radius;
