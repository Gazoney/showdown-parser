/**
 *
 * Showdown Usage Stats Parser
 *
 * This tool is built to parse raw data logs from Pokemon Showdown
 * into usage stat reports, and other interesting reports.
 *
 */

const cluster         = require('cluster')
const config          = require('./config')
const utils           = require('./utils')

global.Dex            = require('@pkmn/dex').Dex

const WriteData       = require('./routines/writeData')
const LoadData        = require('./routines/loadData')
const LogProcessor    = require('./routines/logProcessor')

const formatData      = require('./routines/formatData')
const formatUsage     = require('./routines/formatUsage')
const formatJSON      = require('./routines/formatJSON')
const [format, date, cutoff, output, skipLogs]  = args

if(skipLogs) {
  // Skip parsing logs, require the compiled data set to build
  // an output
  switch(output) {
    case 'usage':
      // Write formatted data to .txt
      WriteData.formatted(
        format,
        date,
        cutoff,
        formatData(
          LoadData.compiled(format,date,cutoff),
          LoadData.raw(format,date,cutoff)
        )
      )
      break
    case 'ranking':
      // Write formatted data to .txt
      WriteData.usage(
        format,
        date,
        cutoff,
        formatUsage(
          LoadData.compiled(format,date,cutoff),
          LoadData.raw(format,date,cutoff)
        )
      )
      break
    case 'json':
      // Write formatted data to .json
      WriteData.JSON(
        format,
        date,
        cutoff,
        formatJSON(
          LoadData.compiled(format,date,cutoff),
          LoadData.raw(format,date,cutoff)
        )
      )
      break
  }
}
else {
  // Main threading split occurs here. The initial running thread
  // will get master status, and spawn workers for each core the
  // app is being provided.
  if (cluster.isMaster) {
    LogProcessor.doMasterThread(format,date,cutoff,output,cluster)
  } else {
    LogProcessor.doWorkerThread(cluster)
  }
}
