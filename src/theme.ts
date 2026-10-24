import { useColorScheme } from 'react-native';

const light = {
  bg: '#F3F6F2', card: '#FFFFFF', soft: '#E8EDE7', line: '#DCE3DA',
  ink: '#14201A', muted: '#5F6E66',
  forest: '#1F5C3F', forest2: '#2F7A55', forestSoft: '#DDEBE2',
  banana: '#F2C230', bananaSoft: '#FCF1CC',
  no: '#C2412F', noSoft: '#F8E1DC', share: '#C86A12', sky: '#2C6E9E', skySoft: '#DEEAF3', onAccent: '#FFFFFF',
};
const dark: typeof light = {
  bg: '#0F1512', card: '#18211C', soft: '#212C25', line: '#2C3A31',
  ink: '#E6EEE8', muted: '#97A69D',
  forest: '#3E8C62', forest2: '#6FBF92', forestSoft: '#1E3529',
  banana: '#F2C230', bananaSoft: '#3A3218',
  no: '#E57C6C', noSoft: '#3E221D', share: '#E59A52', sky: '#7FB2D8', skySoft: '#1B2E3D', onAccent: '#FFFFFF',
};
export type Palette = typeof light;
export function useTheme(): Palette {
  return useColorScheme() === 'dark' ? dark : light;
}
export const radius = { card: 16, pill: 999 };
