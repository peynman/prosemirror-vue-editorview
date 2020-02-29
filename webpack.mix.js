const mix = require('laravel-mix');
let exec = require('child_process').exec;
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.config.webpackConfig.output = {
    chunkFilename: '[name].bundle.js',
    publicPath: 'dis',
};

mix.js('src/index.js', '/js')
    .extract([
        'vue',
        'vue-template-compiler',
    ]).setPublicPath('dist/');


mix.sass('sass/prosemirror.scss', 'dist/css')
    .setResourceRoot('../')
    .then(() => {
        exec('node_modules/rtlcss/bin/rtlcss.js dist/css/prosemirror.css dist/css/prosemirror-rtl.css');
    });

if (mix.inProduction()) {
    mix.version();
} else {
}

mix.disableNotifications();
