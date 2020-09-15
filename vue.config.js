let path = require('path')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const { getThemeColors, modifyVars } = require('./src/utils/themeUtil')
const { resolveCss } = require('./src/utils/theme-color-replacer-extend')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
module.exports = {
  devServer: {
    port: 3098,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/*': {
        ws: false,
        // target: 'https://hera-daily.tuya-inc.cn:7799/',
        // target: 'http://127.0.0.1:8121',
        target: 'http://172.16.120.51:8121',
        pathRewrite: { '^/api': '' },
        secure: false,
        changeOrigin: true
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, "./src/theme/theme.less")],
    }
  },
  configureWebpack: config => {
    config.entry.app = ["babel-polyfill", "whatwg-fetch", "./src/main.js"];
    config.plugins.push(
      new ThemeColorReplacer({
        fileName: 'css/theme-colors-[contenthash:8].css',
        matchColors: getThemeColors(),
        injectCss: true,
        resolveCss
      })
    )
  },
  chainWebpack: config => {
    // 生产环境下关闭css压缩的 colormin 项，因为此项优化与主题色替换功能冲突
    if (process.env.NODE_ENV === 'production') {
      config.plugin('optimize-css')
        .tap(args => {
          args[0].cssnanoOptions.preset[1].colormin = false
          return args
        })
    }
    config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
      { languages: ['json', 'javascript', 'html', 'xml', 'sql', 'shell', 'python'] }
    ])
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: modifyVars(),
          javascriptEnabled: true
        }
      }
    },
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false
}
