/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(11, 34, 83)',
          hover: '#1e3a8a',
        },
        accent: '#38BDF8',
        surface: {
          DEFAULT: '#FFFFFF',
          hover: '#F9FAFB',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        text: {
          primary: 'rgb(11, 34, 83)',
          secondary: '#6B7280',
        },
        border: '#E5E7EB',
        bg: '#FFFFFF',
      },
      fontFamily: {
        base: ['Outfit', 'sans-serif'],
        auth: ['Montserrat', 'sans-serif'],
      },
      spacing: {
        'sidebar': '230px',
        'topbar': '56px',
      },
      maxWidth: {
        'container': '1140px',
      }
    },
  },
  plugins: [],
}

