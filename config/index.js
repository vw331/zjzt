'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'vue',
    assetsPublicPath: '/',
    proxyTable: {
      '/weixin': {
        //target: 'https://zt.12ya.net/zjzt/',
        target: 'http://112.17.72.216:8099/zjzt/',
        changeOrigin: true,
        pathRewrite: {
          '^/wexin': '/wexin'
        }
      }
    },

    // Various Dev Server settings
    disableHostCheck: true,
    host:"0.0.0.0", // can be overwritten by process.env.HOST
    port: 8082, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    //assetsChunkRoot: path.resolve(__dirname, 'E:/eclipsePro/zjzt/WebContent/weixin'),
    //assetsSubDirectory: 'vue',
    assetsSubDirectory: 'vue',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: false,  // 取消错误信息检测文件
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
