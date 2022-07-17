const uglifyjs = require('uglifyjs-webpack-plugin');

module.exports = {
  context: __dirname,
  mode: "production",
  devtool: "source-map",
  entry: __dirname + "/src/app.js",
  output: {
    path: __dirname + "/build",
    filename: "app.js"
  },
  optimization: {
      minimizer: [
        new uglifyjs()
      ],
      runtimeChunk: false,
      splitChunks: {
          chunks: "async",
          minSize: 1000,
          minChunks: 2,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          name: true,
          cacheGroups: {
              default: {
                  minChunks: 1,
                  priority: -20,
                  reuseExistingChunk: true,
              },
              vendors: {
                  test: /[\\/]node_modules[\\/]/,
                  priority: -10
              }
          }
      }
  }
};