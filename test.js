const { convertNumber, fixNumber } = require('./utils')
const log = require('./log')

const checksum = { merged: {}, files: [], errors: [] }

function prepareChecksum () {
  checksum.keys = [...argv.multiply, ...argv.divide, ...argv.subtract, ...argv.add]
}

function calculate (array, index) {
  checksum.files[index] = {}

  for (let i = 0; i < array.length; i++) {
    for (const x of argv.add) {
      if (Reflect.has(array[i], x)) {
        if (typeof checksum.files[index][x] !== 'number') checksum.files[index][x] = 0
        checksum.files[index][x] += fixNumber(convertNumber(array[i][x]))
      }
    }

    for (const x of argv.subtract) {
      if (Reflect.has(array[i], x)) {
        if (typeof checksum.files[index][x] !== 'number') checksum.files[index][x] = 0
        checksum.files[index][x] -= fixNumber(convertNumber(array[i][x]))
      }
    }

    for (const x of argv.divide) {
      if (Reflect.has(array[i], x)) {
        if (typeof checksum.files[index][x] !== 'number') checksum.files[index][x] = 0
        checksum.files[index][x] /= fixNumber(convertNumber(array[i][x]))
      }
    }

    for (const x of argv.multiply) {
      if (Reflect.has(array[i], x)) {
        if (typeof checksum.files[index][x] !== 'number') checksum.files[index][x] = 0
        checksum.files[index][x] *= fixNumber(convertNumber(array[i][x]))
      }
    }
  }

  if (!Reflect.has(checksum, 'keys')) { prepareChecksum() }

  for (const k of checksum.keys) {
    if (Reflect.has(checksum.files[index], k)) {
      checksum.files[index][k] = fixNumber(checksum.files[index][k])
    }
  }
}

function check (merged) {
  calculate(merged, 'merged')

  for (const k of checksum.keys) {
    for (const file of checksum.files.entries()) {
      if (Reflect.has(checksum.files.merged, k) && Reflect.has(file, k)) {
        if (checksum.files.merged[k] !== file[k]) {
          checksum.errors.push({
            name: k,
            file: 0,
            merged: checksum.files.merged[k],
            array: file[k]
          })
        }
      }
    }
  }

  log.debug('check', checksum)

  if (checksum.errors.length === 0) {
    log.info('check', 'Es wurden keine Fehler während der Ergebnisprüfung gefunden')
  } else {
    log.warn('check', 'Es wurden folgende Fehler in der Ergebnisprüfung gefunden:')

    for (const e of checksum.errors) {
      log.warn('check', `${e.name}: (Endergebnis) ${e.merged} != ${e.array} (${argv.file[e.file]})`)
    }
  }
}

module.exports = {
  check,
  calculate
}
