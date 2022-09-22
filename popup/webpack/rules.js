const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const babelLoader = {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    loader: "babel-loader"
};

const styleProdLoader = {
    test: /\.(s)css$/,
    use: ["style-loader", "css-loader", "sass-loader"]
};

const cssLoader = {
    test: /\.css$/,
    loader: "css-loader"
};

const fileLoader = {
    test: /\.(ttf|woff|woff2|png|jpe?g|gif)$/,
    exclude: /node_modules/,
    // loader: 'file-loader',
    type: 'asset/inline',
}

const typescriptLoader = {
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    include: [
        path.resolve(__dirname, '../src'), 
        path.resolve(__dirname, '../../common')
     ],
    loader: "ts-loader"
};

const svgLoader = {
    test: /\.svg$/,
    loader: "svg-sprite-loader",
    // type: 'asset/inline',
    include: [path.resolve(__dirname, '../src/assets/icons')]
}

module.exports = {
    babelLoader: babelLoader,
    styleProdLoader: styleProdLoader,
    typescriptLoader: typescriptLoader,
    svgLoader: svgLoader,
    cssLoader: cssLoader,
    fileLoader: fileLoader
}