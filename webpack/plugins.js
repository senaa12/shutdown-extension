const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require("terser-webpack-plugin");
//const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

//#region BASIC 
exports.htmlWebpackPlugin = (filename, chunks) => (new HtmlWebpackPlugin({
    template: path.resolve(__dirname, '../src/common/assets/index.html'),
    filename: filename,
    chunks: [ chunks ],
    cache: false
}));

exports.definePlugin = (isProd) => new webpack.DefinePlugin({
    'process.env': {
        'NODE_ENV': isProd ? JSON.stringify('production') : JSON.stringify('development')
    },
})

//#endregion

//#region PROD
exports.hashedModulePlugin = new webpack.ids.HashedModuleIdsPlugin();

exports.miniCssPlugin = new MiniCssExtractPlugin({
    filename: "[name].[hash].css",
    chunkFilename: "[name].[hash].css"
});

exports.terserPlugin = new TerserPlugin({
})

// exports.eslintPlugin = new ESLintPlugin({
//   files: ['./src/**/*.ts', './src/**/*.tsx']
// })

exports.providePlugin = new webpack.ProvidePlugin({
    process: 'process/browser'
});


exports.copyChromeExtensionAssets = new CopyPlugin([
    { 
        from: path.resolve(__dirname, "../manifest.json"),
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
