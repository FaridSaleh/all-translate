/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    colors: {
      primary: {
        main: '#1D4ED8',
        light: '#3B82F6',
      },
      accent: {
        main: '#F7931E',
        second: '#FDBA74',
        freeBlue: '#3B82F6',
      },
      text: {
        primary: '#000000',
        secondary: '#485563',
        link: '#2563EB',
        onPrimary: '#FFFFFF',
        onDisabled: '#9CA3AF',
        disabled: '#9CA3AF',
        third: '#8E8E93',
        bgDisabled: '#F3F4F6',
        borderDisabled: '#D1D5DB',
      },
      border: {
        DEFAULT: '#E0E6F0',
        focus: '#2563EB',
        error: '#EF4444',
        success: '#22C55E',
      },
      hover: {
        buttonPrimary: '#1E4FDB',
        card: '#F3F4F6',
        link: '#1E40AF',
      },
      status: {
        success: '#22C55E',
        warning: '#FACC15',
        error: '#EF4444',
        info: '#3B82F6',
      },
      shadow: {
        DEFAULT: '#000000',
        hover: '#000000',
      },
      divider: {
        DEFAULT: '#F3F4F6',
      },
      bg: {
        base: '#F7FAFF',
        card: '#FFFFFF',
        premiumGradientTop: '#D2E5FF',
        premiumGradientBottom: '#F4F8FF',
        neutral: '#FFFFFF',
        buttonPrimary: '#2563EB',
        buttonDisabled: '#D1D5DB',
        input: '#FFFFFF',
        disabled: '#FFFFFF',
        elevated: '#FAFAFA',
        warning: '#FFF8E1',
        success: '#E6F4EA',
        badgeProBg: '#2563EB',
        badgeFreeBg: '#FACC15',
      },
    },
  },
  plugins: [],
}
