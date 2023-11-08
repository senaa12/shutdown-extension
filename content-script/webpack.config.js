const path = require("path");
const webpack = require("webpack");

const isProd = process.env.ENV !== "dev";

module.exports = {
    mode: 'production',
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
          loader: "ts-loader"
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({ 
        'process.env': { 
            PRODUCTION: JSON.stringify(isProd),
        }
      })
    ]
}