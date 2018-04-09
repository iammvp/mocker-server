import fs from 'fs'
import Mock from '../lib/Mock'
const express = require('express')
let app = null
let server = null

function startServer (event, isRestart = false) {
  app = express()
  // set for cros
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.header('Expires', '-1')
    res.header('Pragma', 'no-cache')
    next()
  })
  const selectSchemas = state.SchemaList.schemaLists.filter(s => s.isSelect === true)
  if (hasSamePath(selectSchemas) === true) {
    event.sender.send('hasSamePath')
  } else {
    const jsonLists = selectSchemas.filter(s => s.type === 'json') // json list
    const schemaLists = selectSchemas.filter(s => s.type === 'schema') // schema list
    jsonLists.forEach(s => {
      fs.readFile(s.filePath, 'utf-8', (err, file) => {
        let json
        if (err) {
          json = {
            'error': `文件${s.filePath}不存在`
          }
        } else {
          json = file
        }
        app.get(s.path, (req, res) => {
          res.send(JSON.parse(json))
        })
      })
    })
    schemaLists.forEach(s => {
      const mock = new Mock(s.schema)
      mock.init()
      const data = mock.getOutput()
      app.get(s.path, (req, res) => {
        res.send(JSON.parse(data))
      })
    })
    server = app.listen(9999, () => {
      if (isRestart) {
        event.sender.send('serverRestarted')
      } else {
        event.sender.send('serverStarted')
      }
    })
  }
}

function stopServer (event) {
  server.close()
  app = null // destroy app whenever server closed
  event.sender.send('serverStoped') // send stop success to renderer
}
function restartServer (event) {
  app = null // destroy app whenever server closed
  server.close()
  startServer(event, true)// set true for restart sever
}
function hasSamePath (selectSchemaLists) { // whether selectSchemaLists has same path
  const len = selectSchemaLists.length
  const dict = {}
  for (let i = 0; i < len; i++) {
    if (dict.hasOwnProperty(selectSchemaLists[i].path)) {
      return true
    } else {
      dict[selectSchemaLists[i].path] = true
    }
  }
  return false
}
const localServer = {
  startServer,
  stopServer,
  restartServer
}
export default localServer
