const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
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
    new FilterWarningsPlugin({
      exclude: [
        /mongodb/,
        /mssql/,
        /mysql/,
        /mysql2/,
        /oracledb/,
        /pg/,
        /pg-native/,
        /pg-query-stream/,
        /redis/,
        /react-native-sqlite-storage/,
        /sql/,
        /sqlite3/,
      ],
    }),
    new webpack.IgnorePlugin(/^pg-native$/),
  ],
  optimization: {
    minimize: false,
  },
};
