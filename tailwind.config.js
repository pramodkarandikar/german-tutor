/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                logo: ['"Playwrite NZ Guides"', 'cursive'],
                heading: ['Bitter', 'serif'],
            },
            colors: {
                background: 'var(--background)',
                surface: 'var(--surface)',
                primary: 'var(--primary)',
                'primary-foreground': 'var(--primary-foreground)',
                text: 'var(--text)',
                'text-muted': 'var(--text-muted)',
                border: 'var(--border)',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(10px) scale(0.95)' },
                    '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
                },
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '20%, 60%': { transform: 'translateX(-10px)' },
                    '40%, 80%': { transform: 'translateX(10px)' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.3s ease-out',
                'fade-in-up': 'fade-in-up 0.4s ease-out',
                shake: 'shake 0.5s ease-in-out',
            },
        },
    },
    plugins: [],
}
