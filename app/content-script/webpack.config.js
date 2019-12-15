const path = require("path");

module.exports = {
    entry: './content-script/src/content-script.ts',
     output: {
        path: path.resolve('public'),
        filename: 'content-script.js'
    },
    resolve: {
      alias: {
        common: path.resolve(__dirname, '../common')
      },
      extensions: [ '.ts' ]
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          include: [
             path.resolve(__dirname, 'src'), 
             path.resolve(__dirname, '../common')
          ],
          loader: "awesome-typescript-loader"
        }
      ]
    }
}