const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const definePlugin = (isProd) => new webpack.DefinePlugin({ 
    'process.env': { 
        PRODUCTION: JSON.stringify(isProd)
    },
    '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })'
});

const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: "popup/src/index.html"
});

// const miniCssExtractPlugin = new MiniCssExtractPlugin({
//     filename: "[name].css",
//     chunkFilename: "[name].css"
// });

const copyWebpackPlugin = new CopyPlugin([
    { 
        from: path.resolve(__dirname, "../../manifest.json"),
        to: "manifest.json",
    },
    {
        from: "resources/icon.png",
        to: "icon.png"
    },
    {
        from: "resources/icon-shutdown.png",
        to: "icon-shutdown.png"
    },
    {
        from: "resources/logo-48.png",
        to: "logo-48.png"
    },
    {
        from: "resources/logo-128.png",
        to: "logo-128.png"
    },
]);

const cssMinimizer = new CssMinimizerPlugin();

module.exports = {
    definePlugin: definePlugin,
    htmlWebpackPlugin: htmlWebpackPlugin,
    //miniCssExtractPlugin: miniCssExtractPlugin,
    copyWebpackPlugin: copyWebpackPlugin,
    cssMinimizer
}