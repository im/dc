import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    base: '/dc/',
    plugins: [vue()],
    resolve: {
        alias: [
            {
                find: '@',
                replacement: resolve(__dirname, 'src')
            },
            {
                find: 'stores',
                replacement: resolve(__dirname, 'src/stores')
            },
            {
                find: 'style',
                replacement: resolve(__dirname, 'src/style')
            },
            {
                find: 'components',
                replacement: resolve(__dirname, 'src/components')
            }
        ]
    }
})
