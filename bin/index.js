#!/usr/bin/env node

'use strict'

/**
 * Node modules
 */
const fs = require('fs')
const path = require ('path')
/**
 * NPM dependencies
 */
const rimraf = require("rimraf")
/**
 * Modules
 */
const mkdir = require('./lib.js').mkdir
const dirStrName = require('./lib.js').dirStrName

/**
* Create the build output directory from package.json
* config build section directory name
*/
let outputDir = `../${process.env.npm_package_config_build_outputDir}`
outputDir = path.join(__dirname, outputDir)

if (fs.existsSync(outputDir)){
  rimraf(outputDir, () => { // remove folder if already exists
    console.log(`${dirStrName(outputDir)} already exists`)
    console.log(`${dirStrName(outputDir)} has been removed`)
    mkdir(outputDir) // create dir
  })
} else {
  mkdir(outputDir) // create dir
}
