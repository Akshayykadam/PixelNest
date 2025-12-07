export const theme = {
  colors: {
    white: '#121212', // Dark background
    black: '#FFFFFF', // Light text
    grayBG: '#181818ff', // Darker placeholder
    card: '#1E1E1E', // Card surface
    search: '#3d3d3d',
    placeholder: '#999',
    rose: '#f43f5e',
    // neutral
    neutral: (opacity) => `rgba(255, 255, 255, ${opacity})`, // White with opacity
  },
  fontWeights: {
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  radius: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
  },
};
