const path = require("path");

 const CSSLoaderProd = {
    loader: 'css-loader',
    options: {
        modules: "global",
        importLoaders: 2,
        sourceMap: false, // turned off as causes delay
    }
}

//#region LANGUAGE
exports.babel = {
    test: /\.(js|jsx)$/,
    //exclude: /node_modules/,
    loader: "babel-loader"
};

exports.typescript = {
    test: /\.(tsx|ts)$/,
    exclude: /node_modules/,
    loader: "ts-loader"
}

//#endregion

//#region STYLE
exports.scssDevLoader = {
    test: /\.s?css$/,
    exclude: /node_modules/,
    use: ["style-loader", "css-loader", "sass-loader"]
};

exports.cssLoader = {
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
};

exports.scssProdLoader = {
    test: /\.scss$/,
    exclude: /node_modules/,
    use: ["style-loader", CSSLoaderProd, "sass-loader"]
};

//#endregion

//#region OTHER LOADERS

exports.svgLoader = {
    test: /\.svg$/,
    loader: "svg-sprite-loader",
    // type: 'asset/inline',
    include: [
        path.resolve(__dirname, '../src/popup/assets/icons')
    ]
}

exports.fontLoader = {
    test: /\.ttf$/,
    type: 'asset/inline',
    include: [
        path.resolve(__dirname, '../src/popup/assets/font')
    ]
}

//#endregion
