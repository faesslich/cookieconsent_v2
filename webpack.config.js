const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  entry: {
    cookieconsent_v2: [
      './src/js/cookieconsent_v2.js',
      './src/scss/cookieconsent_v2.scss'
    ]
  },
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist/js/'),
    filename: 'cookieconsent_v2.min.js',
    publicPath: ''
  },
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        minify: CssMinimizerPlugin.cssnanoMinify,
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
        sourceMap: true
      })
    ]
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../css/[name].min.css',
      chunkFilename: '../css/[id].css',
      ignoreOrder: true
    })
  ]
};
