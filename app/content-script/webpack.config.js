const path = require("path");

module.exports = {
    entry: './content-script/src/index.ts',
     output: {
        path: path.resolve('public'),
        filename: 'content-script.js'
    },
    resolve: {
      alias: {
        common: path.resolve(__dirname, '../common')
      },
      extensions: [ '.ts', '.js', '.tsx' ]
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
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