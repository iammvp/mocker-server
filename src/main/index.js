import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import './store'
import localServer from './server'
import getUrl from '../lib/getUrl'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    maximizable: false,
    resizable: false
  })

  mainWindow.loadURL(winURL)
  mainWindow.webContents.on('will-navigate', (event) => event.preventDefault())
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // startServer(app)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
/* 新打开窗口 */
let addSchemaWindow = null
ipcMain.on('openAddWindow', (event, arg) => {
  event.preventDefault()
  if (addSchemaWindow === null) {
    let { path } = arg
    addSchemaWindow = new BrowserWindow({
      height: 563,
      useContentSize: true,
      width: 1000,
      parent: mainWindow,
      show: false,
      maximizable: false,
      resizable: false,
      title: '新规则'
    })
    addSchemaWindow.loadURL(getUrl(path))
    addSchemaWindow.once('ready-to-show', () => {
      addSchemaWindow.show()
    })
    addSchemaWindow.on('closed', () => {
      addSchemaWindow = null
    })
    addSchemaWindow.webContents.on('will-navigate', (event) => {
      event.preventDefault()
    })
  } else {
    addSchemaWindow.center()
  }
})
ipcMain.on('addSchemaSuccess', (event, arg) => {
  event.preventDefault()
  if (addSchemaWindow) {
    addSchemaWindow.close()
  }

  mainWindow.restore()
})
/* 新打开窗口 */
/* 服务器状态改变 */
ipcMain.on('startServer', (event, arg) => {
  localServer.startServer(event)
})
ipcMain.on('stopServer', (event, arg) => {
  localServer.stopServer(event)
})
ipcMain.on('restartServer', (event, arg) => {
  localServer.restartServer(event)
})
/* 服务器状态改变 */

/* 自动更新 */
let updateReady = false
function sendStatusToWindow (text) {
  mainWindow.webContents.send('updateStatus', text)
}
app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
app.on('before-quit', () => {
  if (updateReady) {
    autoUpdater.quitAndInstall()
  }
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('检测到新版本,后台自动下载,下载完成会提示')
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow(err)
})
autoUpdater.on('update-downloaded', () => {
  sendStatusToWindow('下载成功,关闭程序会自动安装')
  updateReady = true
})
/* 自动更新 */
