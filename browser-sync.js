const browserSync = require('browser-sync')

// require config
const config = require('./config/browser-sync-config')
// initialize BrowserSync
browserSync.init(config)
