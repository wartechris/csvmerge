const fs = require('fs')
const path = require('path')
const csv = require('csvtojson/v2')
const { parse } = require('json2csv')

const log = require('./log')

let blankFieldsCount = 0

async function readCSV () {
  const readOptions = {
    delimiter: argv.delimiter,
    flatKeys: argv.flatKeys
  }

  log.debug('read', readOptions)

  const files = []

  for (const [index, file] of argv.file.entries()) {
    if (!fs.existsSync(path.join(__dirname, argv.pathPrefix, file))) {
      throw new Error(`File "${file}" does not exist`)
    }

    files[index] = await csv(readOptions)
      .fromFile(path.join(__dirname, argv.pathPrefix, file))
    log.debug('read', `${file} erfolgreich ausgelesen`)
  }

  return files
}

function parseCSV (merged) {
  const parseOptions = {
    delimiter: argv.delimiter
  }

  log.debug('parse', parseOptions)
  return parse(merged, parseOptions)
}

function writeCSV (csv, merged) {
  if (!fs.existsSync(path.join(__dirname, argv.pathPrefix, argv.outputDir))) {
    fs.mkdirSync(path.join(__dirname, argv.pathPrefix, argv.outputDir))
  }

  fs.writeFileSync(path.join(__dirname, argv.pathPrefix, argv.outputDir, argv.output + '.csv'), csv)
  if (!argv.disableJsonFile) {
    const replacer = (key, value) => {
      if (value === null) return undefined
      else { return value }
    }

    fs.writeFileSync(path.join(__dirname, argv.pathPrefix, argv.outputDir, argv.output + '.json'), JSON.stringify(merged, replacer, 2))
  }
}

function addBlankFields (merged) {
  for (let i = 0; i < merged.length; i++) {
    const obj = merged[i]
    if (argv.addBlankFields.length > 0) {
      argv.addBlankFields.forEach(f => {
        obj[f] = ''
        blankFieldsCount++
      })
    }
  }

  log.debug('process', blankFieldsCount + ' gegebene neue Felder hinzugefügt')
}

function convertNumber (number) {
  if (typeof number !== 'string') return number
  if (argv.german) {
    // remove decimal separator and replace comma with dot
    return parseFloat(number.replaceAll('.', '').replaceAll(',', '.'))
  } else {
    // remove only decimal separator
    return parseFloat(number.replaceAll(',', ''))
  }
}

function processValue (number) {
  if (typeof number !== 'number') return number // text or anything else will be returned

  if (argv.german) {
    // replace dot with comma
    return number.toFixed(argv.fractionDigits).toString().replaceAll('.', ',')
  } else {
    return number.toFixed(argv.fractionDigits)
  }
}

function fixNumber (number) {
  return parseFloat(number.toFixed(argv.fractionDigits))
}

module.exports = {
  readCSV,
  parseCSV,
  writeCSV,
  fixNumber,
  addBlankFields,
  convertNumber,
  processValue
}
