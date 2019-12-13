const path = require("path");

const rules = require("./webpack/rules");
const plugins = require("./webpack/plugins");

module.exports = {
    entry: path.resolve(__dirname, 'popup/src/index'),
    output: {
        path: path.resolve(__dirname, 'popup/dist'),
        filename: 'bundle.js'
    },
    devtool: "source-map",
    devServer: {
        inline: true, // live reloading
        hot: true, // only changed components instead of complete file
        port: 8000,
    },
    module: {
        rules: rules.getRules(false)
    },
    plugins: plugins.getPlugins(false)
}
