const path = require("path");

const babelLoader = {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: "babel-loader"
};

const styleProdLoader = {
    test: /\.(s)css$/,
    use: ["style-loader", "css-loader", "sass-loader"]
};

const cssLoader = {
    test: /\.css$/,
    use: ["css-loader"]
};

const fileLoader = {
    test:  /\.(jpg|jpeg|png|woff|woff2|eot|ttf)$/,
    type: 'asset/resource',
    generator: {
        filename: 'resources/[hash][ext]'
    }
}

const typescriptLoader = {
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    include: [
        path.resolve(__dirname, '../src'), 
        path.resolve(__dirname, '../../common')
    ],
    use: "ts-loader"
};

const svgLoader = {
    test: /\.svg$/,
    use: 'svg-sprite-loader',
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