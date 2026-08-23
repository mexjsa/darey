/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'azul-darey': '#0089A9',
        'azul-profundo': '#005A82',
        'azul-electrico': '#0755E8',
        'cian': '#00B2CF',
        'amarillo-darey': '#F8C400',
        'naranja': '#F5A000',
        'carbon': '#202124',
        'bg-light': '#F4F9FB',
        'bg-subtle': '#EBF3F5',
        'text-muted': '#53626C',
        'border-color': '#D3E2E6',
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grad-darey': 'linear-gradient(135deg, #0089A9 0%, #00B2CF 100%)',
        'grad-profundo': 'linear-gradient(135deg, #005A82 0%, #0755E8 100%)',
        'grad-amarillo': 'linear-gradient(135deg, #F8C400 0%, #F5A000 100%)',
      },
      boxShadow: {
        'card': '0 12px 30px -8px rgba(0, 90, 130, 0.12)',
        'card-hover': '0 20px 40px -10px rgba(0, 137, 169, 0.22)',
      },
    },
  },
  plugins: [],
}
