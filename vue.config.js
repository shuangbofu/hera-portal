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
        target: 'http://127.0.0.1:8121',
        // target: 'http://172.16.120.51:8121',
        pathRewrite: { '^/': '' },
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
      { languages: ['json', 'javascript', 'html', 'xml', 'sql', 'shell', 'python', 'ini'] }
    ])
  },

  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#1890ff',
            'primary-1': '#e6f7ff',
            'primary-2': '#bae7ff',
            'primary-3': '#91d5ff',
            'primary-4': '#69c0ff',
            'primary-5': '#40a9ff',
            'primary-6': '#1890ff',
            'primary-7': '#096dd9',
            'primary-8': '#0050b3',
            'primary-9': '#003a8c',
            'primary-10': '#002766',
            'info-color': '#1890ff',
            'success-color': '#52c41a',
            'warning-color': '#faad14',
            'error-color': '#f5222d',
            'alert-info-bg-color': '#e6f7ff',
            'alert-info-border-color': '#91d5ff',
            'alert-success-bg-color': '#f6ffed',
            'alert-success-border-color': '#b7eb8f',
            'alert-warning-bg-color': '#fffbe6',
            'alert-warning-border-color': '#ffe58f',
            'alert-error-bg-color': '#fff1f0',
            'alert-error-border-color': '#ffa39e',
            'processing-color': '#1890ff',
            'menu-dark-submenu-bg': '#000c17',
            'layout-header-background': '#001529',
            'layout-trigger-background': '#002140',
            'layout-body-background': '#f0f2f5',
            'body-background': '#fff',
            'component-background': '#fff',
            'heading-color': 'rgba(0, 0, 0, 0.85)',
            'text-color': 'rgba(0, 0, 0, 0.65)',
            'text-color-inverse': '#fff',
            'text-color-secondary': 'rgba(0, 0, 0, 0.45)',
            'shadow-color': 'rgba(0, 0, 0, 0.15)',
            'border-color-split': '#f0f0f0',
            'background-color-light': '#fafafa',
            'background-color-base': '#f5f5f5',
            'table-selected-row-bg': '#fafafa',
            'table-expanded-row-bg': '#fbfbfb',
            'checkbox-check-color': '#fff',
            'disabled-color': 'rgba(0, 0, 0, 0.25)',
            'menu-dark-color': 'rgba(1, 1, 1, 0.65)',
            'menu-dark-highlight-color': '#fefefe',
            'menu-dark-arrow-color': '#fefefe',
            'btn-primary-color': '#fff'
          },
          javascriptEnabled: true
        }
      }
    },
  },

  assetsDir: 'static/dist/static',
  productionSourceMap: false
}
