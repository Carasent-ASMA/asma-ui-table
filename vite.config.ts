import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import tsConfigPaths from 'vite-tsconfig-paths'
import * as packageJson from './package.json'

const peerDependencies = Object.keys(packageJson.peerDependencies ?? {})

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            jsxRuntime: 'automatic',
        }),
        tsConfigPaths(),
        dts({
            insertTypesEntry: true,
            exclude: ['node_modules/**/*', 'src/stories/**', 'src/**/*.stories.tsx', 'src/components/**/makeData.ts'],
        }),
    ],
    build: {
        minify: 'terser',
        lib: {
            entry: resolve('src', 'index.ts'),
            name: 'asma-ui-table',
            formats: ['es'],
            fileName: (format) => `asma-ui-table.${format}.js`,
        },
        rollupOptions: {
            external: (id) => peerDependencies.some((dependency) => id === dependency || id.startsWith(`${dependency}/`)),
            output: {
                // globals: {
                //     react: 'React',
                //     'react/jsx-runtime': 'react/jsx-runtime',
                //     'react-dom': 'ReactDOM',
                // },
            },
        },
    },
})
