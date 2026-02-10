import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
    plugins: [
        glsl({
            include: ['**/*.glsl', '**/*.vert', '**/*.frag'],
            compress: true
        })
    ],
    build: {
        target: 'esnext',
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: {
                    three: ['three'],
                    gsap: ['gsap']
                }
            }
        }
    },
    server: {
        port: 5173,
        open: true
    }
});
