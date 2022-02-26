const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/render/development.js',
  output: {
    filename: 'render.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      minify: true,
      template: './src/render/html/index.html',
    }),
  ],
  devServer: {
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          /node_modules/,
          /electron/,
        ],
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: /\.module\.css$/
              },
            },
          },
          'postcss-loader',
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|ttf|woff|otf)$/,
        use: [
          {
            loader: 'file-loader',
          }
        ]
      },
    ],
  },
};
