/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-black': '#0a0a0a',
        'charcoal': '#1a1a1a',
        'ls-orange': '#F05E23', // Los Santos Customs vibe
        'asphalt-gray': '#2A2A2A', // Street underground vibe
        'neon-red': '#E4002B', // A deeper tail-light red
        'ls-gold': '#F2A900', // Classic GTA gold
        'neon-purple': '#b026ff',
        'neon-green': '#5CCF45',
        'electric-blue': '#00e5ff',
        'oracle-gold': '#FFD700',
      },
      fontFamily:{
    heading:['Outfit','sans-serif'],
    body:['Inter','sans-serif']
},
      scale: {
        '103': '1.03',
      },
      animation: {
        'pulse-slow': 'pulse-border 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      borderRadius: {
  xl2: "22px",
  xl3: "28px",
},

boxShadow: {
  glass: "0 20px 45px rgba(0,0,0,.45)",
  purple: "0 0 30px rgba(176,38,255,.22)",
  blue: "0 0 30px rgba(0,229,255,.18)",
},

transitionTimingFunction: {
  smooth: "cubic-bezier(.22,.61,.36,1)",
},

backgroundImage: {
  "trs-gradient":
    "linear-gradient(135deg,#b026ff 0%,#00e5ff 100%)",
  "glass-gradient":
    "linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02))",
},
      keyframes: {
        'pulse-border': {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 1 },
        }
      }
    },
  },
  plugins: [],
}
