const path = require("path");

module.exports = {
    entry: './background/src/background.ts',
     output: {
        path: path.resolve('public'),
        filename: 'background.js'
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