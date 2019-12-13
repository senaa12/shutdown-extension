const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const babel = {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    loader: "babel-loader"
};

const styleDevLoader = {
    test: /\.(s)css$/,
    exclude: /node_modules/,
    loader: ["style-loader", "css-loader", "sass-loader"]
};

const styleProdLoader = {
    test: /\.(s)css$/,
    exclude: /node_modules/,
    loader: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
}

exports.getRules = (isProd) => {
    let rules = [];

    if(isProd) {
        rules.push(...[styleProdLoader]);
    } else {
        rules.push(...[styleDevLoader]);
    }

    rules.push(...[babel]);

    return rules;
}