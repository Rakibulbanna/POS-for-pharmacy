/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        left_right: {
          '0%': { transform: 'scale(0.5) translateX(-100%)', opacity: 0 },
          // '75%':{left: '-10%'},
          '100%': { transform: 'scale(1) translateX(0%)', opacity: 1 },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg) ' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'slide-right':{
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' }  
        },
        'slide-left':{
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)'}  
        },
        scale:{
          '0%': { transform: 'scale(0)',opacity:0 },
          '100%': { transform: 'scale(1)',opacity:1}  
        },
        wave: {
          '0%': {
            left: '0px',
            top: '0px'
          },
          '50%': {
            left: '-2000px',
            top: '200px'
          },
          '100%': {
            left: '0px',
            top: '0px'
          }
        },
        swell: {
          '0%': {
            transform: 'translate3d(0,-25px,0)',
          },
          '50%': {
            transform: 'translate3d(0,5px,0)'
          },
          '100%': {
            transform: 'translate3d(0,-25px,0)',
          }
        }
      },
      animation: {
        // wave: 'wave 7s cubic-bezier( 0.36, 0.45, 0.63, 0.53) -.125s infinite, swell 7s ease -1.25s infinite',
        wave: ' wave 7s cubic-bezier( 0.36, 0.45, 0.63, 0.53) infinite',
        rotate: 'rotate 10s linear infinite both',
        'rotate-slow': 'rotate 180s linear infinite both',
        linear: 'left-right 10s linear infinite both',
        'slide-right': 'slide-right 1s ease-in-out',
        'slide-left': 'slide-left 0.5s ease-in-out',
        'scale': 'scale 0.5s ease-in-out',
        // 'slide-left': 'slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
        
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}
