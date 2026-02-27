export const theme = {
  colors: {
    primary: '#6C5CE7',
    primaryDark: '#5B4BC4',
    primaryLight: '#A29BFE',
    secondary: '#00D4FF',
    secondaryDark: '#00B8E6',
    
    success: '#00E676',
    warning: '#FFB300',
    danger: '#FF3B30',
    info: '#00D4FF',
    
    background: '#0F0F1E',
    surface: '#1A1A2E',
    surfaceLight: '#252540',
    
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0C0',
    textTertiary: '#6B6B8F',
    
    border: '#2A2A45',
    borderLight: '#35355A',
    
    chartColors: ['#6C5CE7', '#00D4FF', '#00E676', '#FFB300', '#FF3B30', '#A29BFE'],
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 999,
  },
  
  typography: {
    h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
    h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
    h4: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
    body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
    bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
    button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  },
  
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;
