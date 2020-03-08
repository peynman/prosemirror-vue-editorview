import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs'; // Convert CommonJS modules to ES6
import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import buble from 'rollup-plugin-buble'; // Transpile/polyfill with reasonable browser support
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import scss from 'rollup-plugin-scss'

export default {
    input: 'src/index.js', // Path relative to package.json
    external: [
        'vue',
    ],
    output: {
        name: 'ProseMirrorVueEditor',
        exports: 'named',
        globals: {
            'vue': 'Vue',
        }
    },
    plugins: [
        resolve({
            browser: true,
            preferBuiltins: true
        }),
        commonjs(),
        vue({
            css: true, // Dynamically inject css as a <style> tag
            compileTemplate: true, // Explicitly convert template to render function
        }),
        buble({
            objectAssign: 'Object.assign',
        }), // Transpile to ES5
        scss({
            // Filename to write all styles to
            output: './dist/css/prosemirror.css',
        }),
        serve({
            open: false,
            contentBase: ['./examples', './dist'],
            port: 9000,
        }),
        livereload(),
    ],
};