const path = require("path");
const webpack = require("webpack");

const isProd = process.env.ENV !== "dev";

module.exports = {
    entry: './background/src/index.ts',
     output: {
        path: path.resolve('public'),
        filename: 'background.js'
    },
    resolve: {
      alias: {
        common: path.resolve(__dirname, '../common'),
        'common-host': path.resolve(__dirname, '../../common')
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
             path.resolve(__dirname, '../common'),
             path.resolve(__dirname, '../../common')
          ],
          loader: "awesome-typescript-loader"
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