'use strict'
/**
 * Node modules
 */
const fs = require('fs')
const path = require ('path')

/**
 * Return last segment in path
 * @param {string} string the given path as a string
 * @returns {string} the cleaned string
 */

const dirStrName = str => `./${str.split(path.sep).reverse()[0]}`

/**
 * Create a directory
 * @param  {path} directory the directory path to create
 */
const mkdir = dist => {
  fs.mkdir(dist, err => {
    if (err) throw err
    console.log(`${dirStrName(dist)} has been created`)
  })
}
/**
 * Exports
 */
module.exports = {mkdir, dirStrName}