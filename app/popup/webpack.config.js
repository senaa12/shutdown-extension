const path = require("path");

const plugins = require("./webpack/plugins");
const rules = require("./webpack/rules");

const isBaseMode = process.env.MODE == "base";
const isDev = process.env.ENV == "dev";

console.log("Is base app: " + isBaseMode);
console.log("Is dev: " + isDev);

module.exports = {
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
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all' // vendor.js posebno izdvaja
        }
    },
    module: {
        rules: [ 
            rules.styleProdLoader, 
            rules.typescriptLoader, 
            rules.svgLoader,
            rules.cssLoader
        ]
    },
    plugins: [ 
        plugins.copyWebpackPlugin(isBaseMode), 
        plugins.miniCssExtractPlugin, 
        plugins.hashedModulePlugin, 
        plugins.definePlugin(!isDev, isBaseMode), 
        plugins.htmlWebpackPlugin 
    ],
}