const { app, BrowserWindow } = require('electron')
const { autoUpdater } = require('electron-updater')
const { generate } = require('shortid')

require('./server')

let win

autoUpdater.setFeedURL({
  provider: 'generic',
  url: 'https://lang-updater.herokuapp.com/download/latest'
})
autoUpdater.on('checking-for-update', () => win.webContents.send('message', 'Checking updates...'))
autoUpdater.on('update-available', () => win.webContents.send('message', 'Update available!'))
autoUpdater.on('error', error => win.webContents.send('message', `Error: ${error}`))
autoUpdater.on('update-downloaded', () => {
  win.webContents.send('message', 'Update downloaded!')
  autoUpdater.quitAndInstall()
})
autoUpdater.on('download-progress', (info) => {
  let message = `Download speed: ${info.bytesPerSecond}`
  message = `${message} - Downloaded ${info.percent}%`
  message = `${message} (${info.transferred}/${info.total})`
  win.webContents.send('message', message)
})

app.on('ready', () => {
  autoUpdater.checkForUpdates()
  win = new BrowserWindow({
    icon: `${__dirname}/icon.png`
  })
  win.webContents.executeJavaScript(`if (window.localStorage.getItem('download-token')) window.localStorage.setItem('download-token', '${generate()}')`)
  win.maximize()
  win.loadURL('http://localhost:4002/app')
})