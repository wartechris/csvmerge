module.exports = () => {
  return require('yargs/yargs')(process.argv.slice(2))
    .usage('$0 <command> [options]')
    .command('merge', 'Zwei .csv-Dateien zusammenfügen')
    .example('$0 merge -f foo.csv bar.csv -b Nr --addStrings Feldname1 --add Umsatz Kosten', 'Fügt zwei .csv-Dateien zusammen über das Feld "Nr"')
    .option('file', {
      array: true,
      description: 'Liste der .csv-Dateien',
      demandOption: true,
      alias: 'f'
    })
    .option('output', {
      string: true,
      description: 'Name für die fertige Datei',
      default: 'merged',
      demandOption: false,
      alias: 'o'
    })
    .option('german', {
      boolean: true,
      description: 'Deutsche Zahlenschreibweise verwenden (z.B 10.000,50 -> 10000.50)',
      demandOption: false,
      default: true,
      alias: 'g'
    })
    .option('flatKeys', {
      boolean: true,
      description: 'Punkte im Header nicht als verschachtelte Objekt/Array Namen interpretieren',
      demandOption: false,
      default: true,
      alias: 'k'
    })
    .option('check', {
      boolean: true,
      description: 'Fehlerüberprüfung am Ende durchführen',
      demandOption: false,
      default: true,
      alias: 'c'
    })
    .option('delimiter', {
      string: true,
      description: 'Trennzeichen der .csv-Dateien',
      demandOption: false,
      default: ';',
      alias: 'd'
    })
    .option('base', {
      string: true,
      description: 'Gemeinsame Basis der .csv-Dateien',
      demandOption: true,
      alias: 'b'
    })
    .option('fractionDigits', {
      number: true,
      description: 'Anzahl der Nachkommastellen (toFixed)',
      demandOption: false,
      default: 2
    })
    .option('stringSeparator', {
      string: true,
      description: 'Trennzeichen für zusammengefügte Strings',
      demandOption: false,
      default: '/'
    })
    .option('addBlankFields', {
      array: true,
      description: 'Leere Felder in Ergebnis hinzufügen',
      demandOption: false,
      default: []
    })
    .option('addStrings', {
      array: true,
      description: 'Felder die bei der Verarbeitung als String addiert werden',
      demandOption: false,
      default: []
    })
    .option('add', {
      array: true,
      description: 'Felder die bei der Verarbeitung addiert werden sollen',
      demandOption: false,
      default: []
    })
    .option('subtract', {
      array: true,
      description: 'Felder die bei der Verarbeitung subtrahiert werden sollen',
      demandOption: false,
      default: []
    })
    .option('divide', {
      array: true,
      description: 'Felder die bei der Verarbeitung dividiert werden sollen',
      demandOption: false,
      default: []
    })
    .option('multiply', {
      array: true,
      description: 'Felder die bei der Verarbeitung multipliziert werden sollen',
      demandOption: false,
      default: []
    })
    .option('debug', {
      boolean: true,
      description: 'Konsolenausgaben (Debug)',
      demandOption: false,
      default: false
    })
    .option('pathPrefix', {
      string: true,
      description: 'Pfadprefix (unix style)',
      demandOption: false,
      default: '../'
    })
    .option('outputDir', {
      string: true,
      description: 'Name des Ausgabeordners',
      demandOption: false,
      default: 'out'
    })
    .option('disableJsonFile', {
      boolean: true,
      description: 'Keine .json-Datei erzeugen',
      demandOption: false,
      default: false
    })
    .option('help', {
      alias: 'h',
      description: 'Hilfeseite anzeigen'
    })
    .locale('de')
    .argv
}
