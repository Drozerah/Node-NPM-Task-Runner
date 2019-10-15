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

// create dist folder
const dist = path.join(__dirname, '../dist')

if (fs.existsSync(dist)){
  rimraf(dist, () => { // remove folder if already exists
    console.log(`${dirStrName(dist)} already exists`)
    console.log(`${dirStrName(dist)} has been removed`)
    mkdir(dist) // create dir
  })
} else {
  mkdir(dist) // create dir
}
