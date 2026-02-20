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
                logo: ['"Alfa Slab One"', 'serif'],
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
        },
    },
    plugins: [],
}
