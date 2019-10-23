
/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | Browsersync Command Line Usage.
 |   https://browsersync.io/docs/command-line
 |
 | Note : $ browser-sync init create a configuration file
 |
 */
// Hitory API Fallback
// const historyApiFallback = require('connect-history-api-fallback')
// @{doc} https://www.npmjs.com/package/connect-history-api-fallback
module.exports = {
  ui: {
    port: 3001
  },
  files: false,
  watchEvents: [
    'change'
  ],
  watch: true, // custom
  ignore: ['**/*.md', 'node_modules/**/*', 'config', 'package.json', 'src/css/**'], // custom
  single: false,
  watchOptions: {
    ignoreInitial: true
  },
  // server: true, // custom
  server: ['src', 'dist'], // https://www.browsersync.io/docs/options/#option-server custom
  // "server": {
  //     "baseDir": 'dist',
  //     "middleware": [historyApiFallback()],
  //     "open": "local"
  // },
  proxy: false,
  port: 3000,
  middleware: false,
  // middleware: [
  //     function (req, res, next) {
  //         /** First middleware handler **/
  //         console.log('Hello from middleware!')
  //         next()
  //     }
  // ],
  serveStatic: [],
  logLevel: 'info',
  browser: 'default',
  cors: false,
  notify: true,
  reloadDelay: 800,
  reloadDebounce: 800,
  reloadThrottle: 0,
  tagNames: {
    less: 'link',
    scss: 'link',
    css: 'link',
    jpg: 'img',
    jpeg: 'img',
    png: 'img',
    svg: 'img',
    gif: 'img',
    js: 'script'
  },
  injectNotification: false
}
