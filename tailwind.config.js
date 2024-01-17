/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      screens: {
        '2xl': '1400px',
        xs: '320px',
      },
      spacing: {
        4.5: '18px',
      },
      keyframes: {
        'accordion-down': {
          from: {height: 0},
          to: {height: 'var(--radix-accordion-content-height)'},
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: 0},
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      colors: {
        primary: {
          25: '#F1F3F4',
          50: '#F5FCFF',
          100: '#EEFAFF',
          200: '#E6F4FA',
          300: '#C5EEFF',
          400: '#9CE2FF',
          500: '#0092CF',
          600: '#0077A8',
        },
        secondary: {
          500: '#FFE600',
        },
        neutral: {
          white: '#FFFFFF',
          black: '#121212',
          400: '#595959',
        },
        grey: {
          25: '#F5F5F5',
          50: '#E5E6E6',
          100: '#CACECE',
          200: '#B0B5B5',
          300: '#969C9C',
          400: '#7B8484',
          500: '#636969',
          600: '#4A4F4F',
          700: '#313535',
          800: '#191A1A',
          900: '#0F1010',
        },
        semantic: {
          danger: {
            100: '#F9F0EF',
            500: '#D92F28',
          },
          success: {
            100: '#CFEED5',
            500: '#3A8348',
          },
          info: {
            100: '#ECEEF6',
            500: '#405AE2',
          },
          warning: {
            100: '#F1EBD3',
            500: '#C8A200',
          },
        },
        status: {
          recieved: '#B22222',
          awaiting: '#B24D22',
          partially_pick: '#A6B222',
          fully_pick: '#068EB9',
          partially_shipped: '#0819BA',
          shipped: '#0A51A4',
          partially_invoice: '#86AF13',
          invoice: '#1A9B36',
          delivered: '#046F3C',
          back_order: '#734808',
        },
      },
      boxShadow: {
        base: '0px 8px 20px -4px rgba(23, 24, 24, 0.12), 0px 3px 6px -3px rgba(23, 24, 24, 0.08)',
        XL: '0px 26px 80px 0px rgba(0, 0, 0, 0.20), 0px 0px 1px 0px rgba(0, 0, 0, 0.20)',
        focus:
          '0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 2px 8px 0px rgba(0, 0, 0, 0.25)',
        xs: '0px 8px 8px -4px rgba(16, 24, 40, 0.04), 0px 20px 24px -4px rgba(16, 24, 40, 0.10)',
        lg: '0px 0px 6px 0px rgba(31, 41, 55, 0.05), 0px 10px 15px 0px rgba(31, 41, 55, 0.10)',
        '3xl':
          '0px 0px 5px 0px rgba(0, 0, 0, 0.05), 0px 1px 2px 0px rgba(0, 0, 0, 0.14)',
        top: '0px -12px 16px 0px rgba(0, 0, 0, 0.08)',
      },
      fontSize: {
        '4.5xl': '2.5rem',
      },
      lineHeight: {
        5.5: '1.375rem',
        7.5: '1.813rem',
        11: '2.75rem',
        14: '3.5rem',
      },
      padding: {
        1.5: '0.375rem',
      },
      flex: {
        full: '0 0 100%',
        quarter: '0 0 20%',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
