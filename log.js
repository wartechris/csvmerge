const logLang = process.env.LOG_LANGUAGE || 'de-DE'
const clc = require('cli-color')

const debug = (module, ...obj) => {
  if (argv.debug) {
    console.debug(`${new Date().toLocaleString(logLang)} ${clc.blue(`[DEBUG] ${module.toUpperCase()}: `)}`,
      ...obj)
  }
}

const info = (module, ...obj) => {
  console.info(`${new Date().toLocaleString(logLang)} ${clc.green(`[INFO] ${module.toUpperCase()}: `)}`,
    ...obj)
}

const warn = (module, ...obj) => {
  console.warn(`${new Date().toLocaleString(logLang)} ${clc.yellow(`[WARN] ${module.toUpperCase()}: `)}`,
    ...obj)
}

const error = (module, ...obj) => {
  console.error(`${new Date().toLocaleString(logLang)} ${clc.red(`[ERROR] ${module.toUpperCase()}: `)}`,
    ...obj)
}

module.exports = {
  debug,
  info,
  warn,
  error
}
