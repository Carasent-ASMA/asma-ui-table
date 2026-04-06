import defaultTheme from 'tailwindcss/defaultTheme'
import twConfigs from './tw-configs/twConfigs.json'

const boxShadow = twConfigs.boxShadow,
    animation = twConfigs.animation,
    keyframes = twConfigs.keyframes,
    colors = twConfigs.colors

export default {
    content: ['index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        fontFamily: {
            roboto: ['Roboto'],
        },
        extend: {
            screens: {
                ...defaultTheme.screens,
            },
            boxShadow,
            animation,
            keyframes,
            colors,
            cursor: {
                'not-allowed-red': 'url("/src/assets/cursors/row-selection-disabled.svg"), not-allowed',
            },
        },
    },
    plugins: [require('tailwind-scrollbar')],
}
