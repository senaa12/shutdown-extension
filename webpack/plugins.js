const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: "popup/index.html"
});

const definePlugin = (isProd) => new webpack.DefinePlugin({ 
    'process.env': { 
        PRODUCTION: isProd 
    },
    '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })'
});

const hotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin();

const hashedModulePlugin = new webpack.HashedModuleIdsPlugin();

const miniCssExtractPlugin = new MiniCssExtractPlugin({
    filename: "[name].css",
    chunkFilename: "[name].css"
});

const copyWebpackPlugin = new CopyPlugin([
    { from: "manifest.json" , to: "" }
])

exports.getPlugins = (isProd) => {
    let plugins = [];

    if(isProd) {
        plugins.push(...[miniCssExtractPlugin, hashedModulePlugin, copyWebpackPlugin]);
    } else {
        plugins.push(...[hotModuleReplacementPlugin])
    }

    plugins.push(...[htmlWebpackPlugin, definePlugin(isProd)]);

    return plugins;
}