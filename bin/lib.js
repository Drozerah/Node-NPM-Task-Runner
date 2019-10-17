'use strict'
/**
 * Node modules
 */
const fs = require('fs')
const path = require('path')

/**
 * Return last segment in path as file name
 * @param {string} string the given path as a string
 * @returns {string} the cleaned string
 */
const dirStrName = str => `${str.split(path.sep).reverse()[0]}`

/**
 * Take a file name and return it with
 * a hash prefix according to boolean
 *
 * @param  {string} string the file name
 * @param  {boolean} boolean the boolean
 * @param  {string} string the hash
 * @returns {string} the input string prefixes with the hash
 */
const addHash = (str, boolean, hash) => {
  if (boolean === true) {
    return `${hash}.${str}`
  } else {
    return str
  }
}

/**
 * Find all files recursively in specific folder with specific extension, e.g:
 * findFilesInDir('./project/src', '.html') ==> ['./project/src/a.html','./project/src/build/index.html']
 * @param  {String} startPath    Path relative to this file or other file which requires this files
 * @param  {String} filter       Extension name, e.g: '.html'
 * @return {Array}               Result files with path string in an array
 * @link https://stackoverflow.com/questions/25460574/find-files-by-extension-html-under-a-folder-in-nodejs/25478516#25478516
 */
function findFilesInDir (startPath, filter) {
  var results = []
  if (!fs.existsSync(startPath)) {
    // console.log("no dir ",startPath)
    return
  }
  var files = fs.readdirSync(startPath)
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i])
    var stat = fs.lstatSync(filename)
    if (stat.isDirectory()) {
      results = results.concat(findFilesInDir(filename, filter)) // recurse
    } else if (filename.indexOf(filter) >= 0) {
      // console.log('-- found: ',filename)
      results.push(filename)
    }
  }
  return results
}

/**
 * Exports
 */
module.exports = {
  dirStrName,
  addHash,
  findFilesInDir
}
