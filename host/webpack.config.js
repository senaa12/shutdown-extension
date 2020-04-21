const path = require("path");

module.exports = {
    target: 'node',
    entry: './src/index.ts',
     output: {
        path: path.resolve('public'),
        filename: 'host.js'
    },
    resolve: {
      alias: {
        common: path.resolve(__dirname, '../common'),
      },
      extensions: [ '.ts', '.js' ]
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          include: [
             path.resolve(__dirname, 'src'), 
             path.resolve(__dirname, '../common'),
          ],
          loader: "awesome-typescript-loader"
        }
      ]
    }
}
