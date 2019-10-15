#!/usr/bin/env node

'use strict'

/**
 * Node modules
 */
const path = require('path')
const async = require("async")
/**
 * NPM dependencies
 */
const fs = require('fs-extra')
const rimraf = require("rimraf")
const chalk = require('chalk')
/**
 * Modules
 */
const dirStrName = require('./lib.js').dirStrName

/**
 * Create the build output directory from package.json
 * config build section directory name
 */
let outputDir = `../${process.env.npm_package_config_build_outputDir}`
outputDir = path.join(__dirname, outputDir)

/**
* Build task 
*/
function buildTask () {
  let htmlNewContent = null
  return async.series([
    callback => { // Step 0 remove existing './dist' folder
      rimraf(outputDir, err => { // remove folder if already exists
        if (err) callback(true, `ERROR-step0 ${err}`)
        callback(false, chalk.yellow('Start build task:'))
      })
    },
    callback => { // Step 1 create build destination folder './dist'
      fs.mkdir(outputDir, err => {
        if (err) callback(true, `ERROR-step1 ${err}`)
        callback(false, `${dirStrName(outputDir)} created`)
      })
    },
    callback => { // Step 2 copy index.html to destination folder
      const fileName = 'index.html'
      const source = `./src/${fileName}`
      const destination = outputDir + path.sep + fileName
      fs.copy(source, destination, err => {
        if (err) callback(true, `ERROR-step2 ${err}`)
        callback(false, `${source} exported`)
      })
    },
    callback => { // Step 3 extract read/write data from index.html 
      const fileName = 'index.html'
      const file = outputDir + path.sep + fileName
      fs.readFile(file, 'utf-8', (err, data) => {
        if (err) callback(true, `ERROR-step3 ${err}`)
        // working with data
        htmlNewContent = data
          .replace(/css\/main.css/gim, 'main.min.css') // CSS mini
          .replace(/app\/js\/bundle.js/gim, 'bundle.js') // new path
        callback(false, `./src/${fileName} parsed`)
      })
    },
    callback => { // Step 4 write html content
      const fileName = 'index.html'
      const destination = outputDir + path.sep + fileName
      fs.writeFile(destination, htmlNewContent, 'utf-8', function (err) {
        if (err) callback(true, `ERROR-step4 ${err}`)
        callback(false, `./dist/${fileName} updated`)
        // reset htmlNewContent
        htmlNewContent = null
      })
    },
    callback => { // Step 5 copy bundle.js to ouput folder
      const fileName = 'bundle.js'
      const source = `./src/app/js/${fileName}`
      const destination = outputDir + path.sep + fileName
      fs.copy(source, destination, err => {
        if (err) callback(true, `ERROR-step5 ${err}`)
        callback(false, `${source} exported`)
      })
    },
    callback => { // Step 6 copy main.min.css to ouput folder
      const fileName = 'main.min.css'
      const source = `./src/css/${fileName}`
      const destination = outputDir + path.sep + fileName
      fs.copy(source, destination, err => {
        if (err) callback(true, `ERROR-step6 ${err}`)
        callback(false, `${source} exported`)
      })
    },
    callback => { // Step 7 copy main.min.css.map to ouput folder
      const fileName = 'main.min.css.map'
      const source = `./src/css/${fileName}`
      const destination = outputDir + path.sep + fileName
      fs.copy(source, destination, err => {
        if (err) callback(true, `ERROR-step7 ${err}`)
        callback(false, `${source} exported`)
      })
    },
    callback => { // Step 8 create ./dist/img subfolder
      const folder = 'img'
      const source = `./src/${folder}`
      const destination = outputDir + path.sep + folder
      fs.copy(source, destination, err => {
        if (err) callback(true, `ERROR-step9 ${err}`)
        callback(false, `${source} exported`)
      })      
    },
  ], (err, results) => {
    if (err) {
      console.log('build task failed!')
      console.log(`ERROR: ${err}`)
    } else {
      results.forEach( res => {
        console.log(res)
      })
      console.log(chalk.green('build task success!'))
    }
  })
}

buildTask()
