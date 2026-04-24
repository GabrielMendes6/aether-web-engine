import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
        server: {
            proxy: {
                '/aether': {
                    target: 'http://54.157.214.133',
                    changeOrigin: true,
                    secure: false,
                },
                '/sanctum': {
                    target: 'http://54.157.214.133',
                    changeOrigin: true,
                    secure: false,
                }
            }
        }
    },
});
