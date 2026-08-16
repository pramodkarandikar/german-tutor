/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Stack Sans Headline', 'sans-serif'],
                logo: ['"Momo Trust Display"', 'sans-serif'],
                heading: ['"Stack Sans Headline"', 'sans-serif'],
            },
            colors: {
                background: 'var(--background)',
                surface: 'var(--surface)',
                primary: 'var(--primary)',
                'primary-foreground': 'var(--primary-foreground)',
                accent: 'var(--accent)',
                'accent-foreground': 'var(--accent-foreground)',
                text: 'var(--text)',
                'text-muted': 'var(--text-muted)',
                border: 'var(--border)',
                'border-subtle': 'var(--border-subtle)',
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
                'pulse-fast': {
                    '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                    '50%': { opacity: '0.7', transform: 'scale(1.08)' },
                },
                'countdown-pop': {
                    '0%': { opacity: '0', transform: 'scale(0.3)' },
                    '50%': { opacity: '1', transform: 'scale(1.2)' },
                    '100%': { opacity: '0', transform: 'scale(0.8)' },
                },
                'score-pop': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.3)' },
                    '100%': { transform: 'scale(1)' },
                },
                'timer-expire': {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-3px)' },
                    '20%, 40%, 60%, 80%': { transform: 'translateX(3px)' },
                },
                'confetti-fall': {
                    '0%': { transform: 'translateY(-100%) rotate(0deg)', opacity: '1' },
                    '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.3s ease-out',
                'fade-in-up': 'fade-in-up 0.4s ease-out',
                shake: 'shake 0.5s ease-in-out',
                'pulse-fast': 'pulse-fast 0.4s ease-in-out infinite',
                'countdown-pop': 'countdown-pop 0.8s ease-out forwards',
                'score-pop': 'score-pop 0.3s ease-out',
                'timer-expire': 'timer-expire 0.4s ease-in-out',
                'confetti-fall': 'confetti-fall 2.5s ease-in forwards',
            },
        },
    },
    plugins: [],
}
