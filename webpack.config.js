const webpack = require('webpack');
const path = require('path');

module.exports = {
  target: 'node',
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          { loader: 'babel-loader' },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  plugins: [
    new webpack.IgnorePlugin(/^pg-native$/),
  ],
};
