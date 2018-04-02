import Datastore from 'nedb'
import path from 'path'
import {app, remote} from 'electron'
const dbPath = process.type === 'browser' ? app.getPath('userData') : remote.app.getPath('userData')
export default new Datastore({
  autoload: true,
  filename: path.join(dbPath, '/data.db')
})
