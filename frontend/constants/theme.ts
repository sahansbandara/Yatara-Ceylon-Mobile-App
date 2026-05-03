const palette = {
  deepEmerald: '#063f32',
  emerald: '#0f5a47',
  antiqueGold: '#d4af37',
  offWhite: '#f8f4ea',
  ink: '#10201b',
  muted: '#69736f',
  white: '#ffffff',
  danger: '#b42318',
  success: '#167a45',
  border: '#e7dfce',
};

export const Colors = {
  ...palette,
  light: {
    text: palette.ink,
    background: palette.offWhite,
    tint: palette.deepEmerald,
    icon: palette.muted,
    tabIconDefault: palette.muted,
    tabIconSelected: palette.deepEmerald,
  },
  dark: {
    text: palette.offWhite,
    background: palette.deepEmerald,
    tint: palette.antiqueGold,
    icon: '#d8e2dc',
    tabIconDefault: '#d8e2dc',
    tabIconSelected: palette.antiqueGold,
  },
};

export const Theme = {
  colors: Colors,
  radius: {
    sm: 8,
    md: 12,
    lg: 18,
  },
  spacing: {
    screen: 20,
  },
};
