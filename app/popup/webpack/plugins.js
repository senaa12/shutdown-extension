const webpack = require("webpack");
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const definePlugin = (isProd , isBaseApp) => new webpack.DefinePlugin({ 
    'process.env': { 
        IS_BASE: JSON.stringify(isBaseApp),
        PRODUCTION: JSON.stringify(isProd)
    },
    '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })'
});

const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: "popup/src/index.html"
});

const hashedModulePlugin = new webpack.HashedModuleIdsPlugin();

const miniCssExtractPlugin = new MiniCssExtractPlugin({
    filename: "[name].css",
    chunkFilename: "[name].css"
});

const copyWebpackPlugin = (isBaseApp) => new CopyPlugin([
    { 
        from: isBaseApp ? 
            "resources/manifest.lite.json" : 
            "resources/manifest.full.json", 
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

module.exports = {
    definePlugin: definePlugin,
    htmlWebpackPlugin: htmlWebpackPlugin,
    hashedModulePlugin: hashedModulePlugin,
    miniCssExtractPlugin: miniCssExtractPlugin,
    copyWebpackPlugin: copyWebpackPlugin
}