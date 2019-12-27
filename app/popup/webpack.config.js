const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: "popup/src/index.html"
});

const definePlugin = (isProd) => new webpack.DefinePlugin({ 
    'process.env': { 
        PRODUCTION: isProd 
    },
    '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })'
});

const hashedModulePlugin = new webpack.HashedModuleIdsPlugin();

const miniCssExtractPlugin = new MiniCssExtractPlugin({
    filename: "[name].css",
    chunkFilename: "[name].css"
});

const copyWebpackPlugin = new CopyPlugin([
    { from: "manifest.json" , to: "" }
]);

// not used currently
const babelLoader = {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    loader: "babel-loader"
};

const styleProdLoader = {
    test: /\.(s)css$/,
    exclude: /node_modules/,
    loader: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
};

const typescriptLoader = {
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    include: [
        path.resolve(__dirname, 'src'), 
        path.resolve(__dirname, '../common')
     ],
    loader: "awesome-typescript-loader"
};

const svgLoader = {
    test: /\.svg$/,
    loader: "svg-sprite-loader",
    include: [path.resolve(__dirname, 'src/assets/icons')]
}

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
        rules: [ styleProdLoader, typescriptLoader, svgLoader ]
    },
    plugins: [ copyWebpackPlugin, miniCssExtractPlugin, hashedModulePlugin, definePlugin(true), htmlWebpackPlugin ],
}