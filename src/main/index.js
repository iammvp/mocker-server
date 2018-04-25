import { app, BrowserWindow, ipcMain, Menu } from 'electron'
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
  const template = [
    {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {role: 'selectall'}
      ]
    },
    {
      label: 'View',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload'},
        {role: 'toggledevtools'},
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    },
    {
      role: 'window',
      submenu: [
        {role: 'minimize'},
        {role: 'close'}
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('https://electronjs.org') }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {role: 'services', submenu: []},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    })

    // Edit menu
    template[1].submenu.push(
      {type: 'separator'},
      {
        label: 'Speech',
        submenu: [
          {role: 'startspeaking'},
          {role: 'stopspeaking'}
        ]
      }
    )

    // Window menu
    template[3].submenu = [
      {role: 'close'},
      {role: 'minimize'},
      {role: 'zoom'},
      {type: 'separator'},
      {role: 'front'}
    ]
  }
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
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
