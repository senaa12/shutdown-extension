const path = require("path");

module.exports = {
    entry: './background/background.js',
     output: {
        path: path.resolve('public'),
        filename: 'background.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    }
}