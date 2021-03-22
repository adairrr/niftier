const path = require("path");
const webpack = require('webpack');
const CracoAntDesignPlugin = require('craco-antd');
const darkTheme = require('@ant-design/dark-theme');


module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: darkTheme,
            javascriptEnabled: true,
          },
        },
        // customizeTheme: {
        //   '@primary-color': '#1DA57A'
        // //   '@font-family': 'Rubik, sans-serif',
        // //   '@font-size-base': '16px',
        // //   '@text-color': CONFIG.textColor,
        // //   '@border-radius-base': '5px'
        // },
        babelPluginImportOptions: {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true
        }
      }
    }
  ],
  // plugins: [
  //   {
  //     plugin: CracoLessPlugin,
  //     options: {
  //       lessLoaderOptions: {
  //         lessOptions: {
  //           modifyVars: { '@primary-color': '#1DA57A' },
  //           javascriptEnabled: true,
  //         },
  //       },
  //     },
  //   },
  // ],
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
