const path = require("path");

const rules = require("./webpack/rules");
const plugins = require("./webpack/plugins");

module.exports = {
    entry: path.resolve(__dirname, 'popup/index'),
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].js' 
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all' // vendor.js posebno izdvaja
        }
    },
    module: {
        rules: rules.getRules(true)
    },
    plugins: plugins.getPlugins(true),
}