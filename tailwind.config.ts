const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Университетская цветовая схема
        university: {
          primary: '#228B22',      // Основной зеленый
          'primary-dark': '#2E7D32', // Темно-зеленый
          accent: '#667eea',       // Акцентный синий
          background: '#f8f9fa',   // Фон
          panel: '#F2E9D8',        // Бежевый панелей
          'panel-border': '#CBC5B9', // Границы панелей
        },
        
        // Категории объектов
        category: {
          university: '#667eea',
          transport: '#f39c12', 
          poi: '#8e44ad',
          nature: '#27ae60',
          infrastructure: '#95a5a6',
        },
        
        // Состояния
        success: '#28a745',
        warning: '#ffc107',
        danger: '#dc3545',
        info: '#17a2b8',
      },
      
      fontFamily: {
        sans: ['Montserrat', 'Roboto', 'system-ui', 'sans-serif'],
        title: ['Montserrat', 'sans-serif'],
        body: ['Roboto', 'system-ui', 'sans-serif'],
      },
      
      spacing: {
        'header': '7vh',
        'header-mobile': '60px',
        'panel': '420px',
        'panel-mobile': '100vw',
      },
      
      zIndex: {
        'navbar': '1000',
        'panel': '900',
        'modal': '1000',
        'loader': '3000',
        'map-controls': '50',
      },
      
      borderRadius: {
        'panel': '10px',
        'modal': '14px',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [],
}

export default config 