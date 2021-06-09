#!/usr/bin/env node
'use strict'

global.argv = require('./args')()

const log = require('./log')
const { check, calculate } = require('./test')
const { parseCSV, processValue, convertNumber, readCSV, writeCSV, addBlankFields } = require('./utils')

let mergeCount = 0
let newCount = 0
let processCount = 0
const merged = []

function test (oV, nV) {
  const result = nV
  const oVKeys = Object.keys(oV)
  const nVKeys = Object.keys(nV)

  if (oVKeys.findIndex(e => argv.addStrings.includes(e)) !== -1 && nVKeys.findIndex(e => argv.addStrings.includes(e)) !== -1) {
    argv.addStrings.forEach(e => {
      result[e] = oV[e] + argv.stringSeparator + nV[e]
    })
  }

  if (oVKeys.findIndex(e => argv.add.includes(e)) !== -1 && nVKeys.findIndex(e => argv.add.includes(e)) !== -1) {
    argv.add.forEach(e => {
      result[e] = processValue(convertNumber(oV[e]) + convertNumber(nV[e]))
    })
  }

  if (oVKeys.findIndex(e => argv.subtract.includes(e)) !== -1 && nVKeys.findIndex(e => argv.subtract.includes(e)) !== -1) {
    argv.subtract.forEach(e => {
      result[e] = processValue(convertNumber(oV[e]) - convertNumber(nV[e]))
    })
  }

  if (oVKeys.findIndex(e => argv.multiply.includes(e)) !== -1 && nVKeys.findIndex(e => argv.multiply.includes(e)) !== -1) {
    argv.multiply.forEach(e => {
      result[e] = processValue(convertNumber(oV[e]) * convertNumber(nV[e]))
    })
  }

  if (oVKeys.findIndex(e => argv.divide.includes(e)) !== -1 && nVKeys.findIndex(e => argv.divide.includes(e)) !== -1) {
    argv.divide.forEach(e => {
      result[e] = processValue(convertNumber(oV[e]) / convertNumber(nV[e]))
    })
  }
  return Object.assign(oV, result) // override old data with new data from result
}

function fuse (array) {
  for (let i = 0; i < array.length; i++) {
    const entryIndex = merged.findIndex(x => {
      if (Reflect.has(x, argv.base) && Reflect.has(array[i], argv.base)) {
        return x[argv.base] === array[i][argv.base]
      } else return false
    })

    if (entryIndex > -1) {
      test(merged[entryIndex], array[i])
      mergeCount++
    } else {
      merged[merged.length] = array[i]
      newCount++
    }

    processCount++
  }
}

log.debug('args', argv)
readCSV().then((files) => {
  log.info('read', `Insgesamt ${files.map(e => e.length).reduce((a, e) => a + e)} Zeilen ausgelesen`)

  for (const [i, content] of files.entries()) {
    calculate(content, i) // for checks later

    fuse(content)
  }

  addBlankFields(merged)

  log.info('process', `${processCount} Einträge verarbeitet (${newCount} erstmals angelegt; ${mergeCount} zusammengefügt)`)

  if (argv.check) {
    log.info('check', 'Überprüfe Ergebnisse...')
    check(merged)
  } else {
    log.warn('check', 'Ergebnisüberprüfung übersprungen')
  }

  try {
    const parsed = parseCSV(merged)
    writeCSV(parsed, merged)
    if (!argv.disableJsonFile) {
      log.info('write', `Erfolgreich zusammengeführt und gespeichert unter ${argv.output}.csv (+ ${argv.output}.json)`)
    } else {
      log.info('write', `Erfolgreich zusammengeführt und gespeichert unter ${argv.output}.csv`)
    }
  } catch (e) {
    log.error('write', 'CSV kann nicht generiert werden. ', e)
  }
}).catch(e => log.error('read', e))
