const path = require("path");

const plugins = require("./webpack/plugins");
const rules = require("./webpack/rules");

const isProd = process.env.ENV != "dev";
console.log(`Is prod: ${isProd}\n`);

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
        plugins.copyWebpackPlugin, 
        plugins.miniCssExtractPlugin, 
        plugins.hashedModulePlugin, 
        plugins.definePlugin(isProd), 
        plugins.htmlWebpackPlugin 
    ],
}