const path = require("path");

const plugins = require("./webpack/plugins");
const rules = require("./webpack/rules");

const isProd = process.env.ENV != "dev";
console.log(`Is prod: ${isProd}\n`);

module.exports = {
    mode: 'production',
    entry: "./popup/src/index.tsx",
    output: {
        path: path.resolve(__dirname, '../public'),
        filename: '[name].js' 
    },
    resolve: {
        alias: {
            common: path.resolve(__dirname, '../common')
        },
        extensions: ['.js', '.tsx', '.ts']
    },
    optimization: {
        moduleIds: 'deterministic',
        splitChunks: {
            chunks: 'all' // vendor.js posebno izdvaja
        },
        minimizer: [
            plugins.cssMinimizer
        ]
    },
    module: {
        rules: [ 
            rules.styleProdLoader, 
            rules.typescriptLoader, 
            rules.svgLoader,
            rules.cssLoader,
            rules.fileLoader
        ]
    },
    plugins: [ 
        plugins.copyWebpackPlugin, 
        plugins.definePlugin(isProd), 
        plugins.htmlWebpackPlugin 
    ],
}