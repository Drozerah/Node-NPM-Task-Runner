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
 * Exports
 */
module.exports = {dirStrName}