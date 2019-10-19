#!/usr/bin/env node

/* eslint-disable standard/no-callback-literal */

'use strict'

/**
 * Node modules
 */
const path = require('path')
const async = require('async')
/**
 * NPM dependencies
 */
const fs = require('fs-extra')
const rimraf = require('rimraf')
const chalk = require('chalk')
/**
 * Modules
 */
const dirStrName = require('./lib.js').dirStrName
const addHash = require('./lib.js').addHash
const findFilesInDir = require('./lib.js').findFilesInDir
const settings = require('../.vscode/settings.json')
/**
 * Get config options
 */
const outputDir = `./${process.env.npm_package_config_build_outputDir}` // string to path
const isHash = JSON.parse(process.env.npm_package_config_build_hash) // boolean
const isCompressedCSS = JSON.parse(process.env.npm_package_config_build_compressedCSS) === false ? 0 : 1 // boolean to number
const settingsFormats = settings['liveSassCompile.settings.formats'] // array
const isSourceMap = settings['liveSassCompile.settings.generateMap'] // boolean
/**
*  Some references
*/
// generate hash from current time
const hash = new Date().getTime()
// store content (steps 4, 8, 9)
let fileNewContent
/**
* Files references
*/
// get/find the HTML file from ./src
const HTMLFileName = dirStrName(findFilesInDir('./src', '.html')[0])
const HTMLSourceFIlePath = `./${findFilesInDir('./src', '.html')[0].replace(/\\/gim, '/')}`
const HTMLDestinationFilePath = `${outputDir}/${HTMLFileName}`
// working with CSS file
// we use the prefix string (file name) of the file.scss
// found in ./src/scss to create our prefix.css files
let CSSPrefix = findFilesInDir('./src/scss/', '.scss').filter(str => {
  if (!str.includes('_')) return str
})
// file prefix
CSSPrefix = dirStrName(CSSPrefix[0]).split('.')[0]
// CSS files
const CSSSource = `${CSSPrefix}.css`
const CSSFileName = CSSPrefix + settingsFormats[isCompressedCSS].extensionName
const CSSSourceFilePath = `.${settingsFormats[isCompressedCSS].savePath}/${CSSFileName}`
const CSSDestinationFilePath = `${outputDir}/${addHash(CSSFileName, isHash, hash)}`
/**
* Build tasks
*/
function buildTasks () {
  return async.series([
    /**
    * Step 1
    * Remove './dist' directory if any
    */
    callback => {
      rimraf(outputDir, err => {
        if (err) {
          console.log(chalk.red('ERROR-build-task-step-1'))
          callback(true, err)
        }
        callback(false, chalk.yellow('Start build task:'))
      })
    },
    /**
    * Step 2
    * Make directory './dist'
    */
    callback => {
      fs.mkdir(outputDir, err => {
        if (err) {
          console.log(chalk.red('ERROR-build-task-step-2'))
          callback(true, err)
        }
        callback(false, `${dirStrName(outputDir)} created`)
      })
    },
    /**
    * Step 3
    * Copy file.html to './dist' directory
    */
    callback => {
      const source = HTMLSourceFIlePath
      const destination = HTMLDestinationFilePath
      fs.copy(source, destination, err => {
        if (err) {
          console.log(chalk.red('ERROR-build-task-step-3'))
          callback(true, err)
        }
        callback(false, `${source} exported`)
      })
    },
    /**
    * Step 4
    * Update './dist/file.html'
    */
    callback => {
      // Step 4-A
      // read data from './dist/file.html'
      // store data into fileNewContent variable
      // replace href value in CSS link tag with CSSFileName
      // replace bundle.js, add hash if any
      const file = HTMLDestinationFilePath
      fs.readFile(file, 'utf-8', (err, data) => {
        if (err) {
          console.log(chalk.red('ERROR-build-task-step-4-A'))
          callback(true, err)
        }
        const regex1 = new RegExp(`href="css/${CSSSource}"`, 'g')
        const replace1 = `href="${addHash(CSSFileName, isHash, hash)}"`
        // working with data
        fileNewContent = data
          .replace(regex1, replace1)
          .replace(/app\/js\/bundle.js/gim, addHash('bundle.js', isHash, hash))
        callback(false, `${HTMLSourceFIlePath} parsed`)
      })
    },
    callback => {
      // Step 4-B
      // write/replace './dist/file.html' content
      // using the variable fileNewContent set in the
      // previous step 4-A
      const destination = HTMLDestinationFilePath
      fs.writeFile(destination, fileNewContent, 'utf-8', function (err) {
        if (err) {
          console.log(chalk.red('ERROR-build-task-step-4-B'))
          callback(true, err)
        }
        callback(false, `./dist/${HTMLFileName} updated`)
        // reset fileNewContent
        fileNewContent = undefined
      })
    },
    /**
    * Step 5
    * Copy './src/app/js/bundle.js' to './dist/bundle.js' directory
    */
    callback => {
      const fileName = 'bundle.js'
      const source = `./src/app/js/${fileName}`
      const destination = `${outputDir}/${addHash(fileName, isHash, hash)}`
      fs.copy(source, destination, err => {
        if (err) {
          console.log(chalk.red('ERROR-build-task-step-5'))
          callback(true, err)
        }
        callback(false, `${source} exported ${isHash ? 'with hash' : ''}`)
      })
    },
    /**
    * Step 6
    * Copy './src/css/file.css' to './dist/files.css'
    */
    callback => {
      const source = CSSSourceFilePath
      const destination = CSSDestinationFilePath
      fs.copy(source, destination, err => {
        if (err) {
          console.log(chalk.red('ERROR-build-task-step-6'))
          callback(true, err)
        }
        callback(false, `${source} exported ${isHash ? 'with hash!!' : ''}`)
      })
    },
    /**
    * Step 7
    * Copy './src/css/file.css.map' to './dist/file.css.map' if any
    */
    callback => {
      if (isSourceMap) {
        const source = CSSSourceFilePath + '.map'
        const destination = CSSDestinationFilePath + '.map'
        fs.copy(source, destination, err => {
          if (err) {
            console.log(chalk.red('ERROR-build-task-step-7'))
            callback(true, err)
          }
          callback(false, `${source} exported ${isHash ? 'with hash' : ''}`)
        })
      } else {
        callback(false, 'step aborted')
      }
    },
    /**
    * Step 8
    * Update source map file if any
    */
    callback => {
      // Step 8-A
      // read data from './dist/hash.file.css.map'
      // store data into fileNewContent variable
      // replace the value of the "file" key with
      // the CSSFileName
      if (isSourceMap) {
        const file = CSSDestinationFilePath + '.map'
        fs.readFile(file, 'utf-8', (err, data) => {
          if (err) {
            console.log(chalk.red('ERROR-build-task-step-8-A'))
            callback(true, err)
          }
          // working with data
          const regex = new RegExp(CSSFileName, 'g')
          fileNewContent = data
            .replace(regex, `${addHash(CSSFileName, isHash, hash)}`)
          callback(false, `${file} parsed`)
        })
      } else {
        callback(false, 'step aborted') // no source map case
      }
    },
    callback => {
      // Step 8-B
      // write/replace ./dist/hash.file.css.map content
      // using the variable fileNewContent set in the
      // previous step 8-A
      if (isSourceMap) {
        const destination = CSSDestinationFilePath + '.map'
        fs.writeFile(destination, fileNewContent, 'utf-8', function (err) {
          if (err) {
            console.log(chalk.red('ERROR-build-task-step-8-B'))
            callback(true, err)
          }
          callback(false, `${destination} updated`)
          // reset fileNewContent
          fileNewContent = undefined
        })
      } else {
        callback(false, 'step aborted') // no source map case
      }
    },
    /**
    * Step 9
    * Update CSS file source mapping URL if any
    */
    callback => {
      // Step 9-A
      // read data from './dist/hash.file.css'
      // store data into fileNewContent variable
      // replace the source mapping URL with
      // the CSSFileName
      if (isSourceMap) {
        const file = CSSDestinationFilePath
        fs.readFile(file, 'utf-8', (err, data) => {
          if (err) {
            console.log(chalk.red('ERROR-build-task-step-9-A'))
            callback(true, err)
          }
          // working with data
          const regex = new RegExp(CSSFileName, 'g')
          fileNewContent = data
            .replace(regex, `${addHash(CSSFileName, isHash, hash)}`)
          callback(false, `${file} parsed`)
        })
      } else {
        callback(false, 'step aborted') // no source map case
      }
    },
    callback => {
      // Step 9-B
      // write/replace './dist/hash.file.css 'content
      // using the variable fileNewContent set in the
      // previous step 10-A
      if (isSourceMap) {
        const destination = CSSDestinationFilePath
        fs.writeFile(destination, fileNewContent, 'utf-8', function (err) {
          if (err) {
            console.log(chalk.red('ERROR-build-task-step-8-B'))
            callback(true, err)
          }
          callback(false, `${CSSDestinationFilePath} updated`)
          // reset fileNewContent
          fileNewContent = undefined
        })
      } else {
        callback(false, 'step aborted') // no source map case
      }
    },
    /**
    * Step 10
    * Copy/export './src/img' to './dist/img'
    */
    callback => {
      const folder = 'img'
      const source = `./src/${folder}`
      const destination = outputDir + path.sep + folder
      fs.copy(source, destination, err => {
        if (err) {
          console.log(chalk.red('ERROR-build-task-step-10'))
          callback(true, err)
        }
        callback(false, `${source} exported`)
      })
    }
  ], (err, results) => { // Results
    if (err) {
      console.log(chalk.red('build task failed!'))
      console.log(`ERROR: ${err}`)
    } else {
      results.filter(res => {
        if (res !== 'step aborted') {
          console.log(res)
        }
      })
      console.log(chalk.green('build task success!'))
      // console.log(chalk.cyan(`fileNewContent? ${fileNewContent}`))
      // console.log(chalk.cyan(`isSourceMap? ${isSourceMap}`))
    }
  })
}

buildTasks()
