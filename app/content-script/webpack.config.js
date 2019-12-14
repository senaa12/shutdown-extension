const path = require("path");

module.exports = {
    entry: './content-script/src/content-script.ts',
     output: {
        path: path.resolve('public'),
        filename: 'content-script.js'
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: "awesome-typescript-loader"
      }
      ]
    }
}