const path = require("path");
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.extensions.push('.json');
      // Allow importing .ts and .tsx files without specifying the extension
      webpackConfig.resolve.extensions.push('.ts');
      webpackConfig.resolve.extensions.push('.tsx');

      // const rawLoader = {
      //   test: /\.md$/,
      //   exclude: /node_modules/,
      //   use: [
      //     {
      //       loader: require.resolve('raw-loader'),
      //       options: {
              
      //       },
      //     },
      //   ],
      // };

      // addBeforeLoader(webpackConfig, loaderByName('file-loader'), rawLoader);

      return webpackConfig;
    },
  },
};
