const path = require("path");
const webpack = require("webpack");

const isDev = process.env.ENV === "dev";
const isBaseMode = process.env.MODE == "base";

module.exports = {
    entry: './background/src/index.ts',
     output: {
        path: path.resolve('public'),
        filename: 'background.js'
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
    },
    plugins: [
      new webpack.DefinePlugin({ 
        'process.env': { 
            PRODUCTION: JSON.stringify(!isDev),
            IS_BASE: JSON.stringify(isBaseMode)
        }
      })
    ]
}