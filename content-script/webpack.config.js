const path = require("path");

module.exports = {
    entry: './content-script/content-script.js',
     output: {
        path: path.resolve('public'),
        filename: 'content-script.js'
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