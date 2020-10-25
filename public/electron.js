const { app, BrowserWindow, dialog } = require('electron')
const { autoUpdater } = require('electron-updater')
const { generate } = require('shortid')

require('./server')

let win

autoUpdater.setFeedURL({
  provider: 'generic',
  url: 'https://lang-updater.herokuapp.com/download/latest'
})
autoUpdater.on('checking-for-update', () => console.log('Checking updates...'))
autoUpdater.on('update-available', info => {
  dialog.showMessageBox(null, {
    type: 'info',
    message: 'Update available!',
    detail: `${info.version} released.`
  })
})
autoUpdater.on('error', error => console.error(`Error: ${error}`))
autoUpdater.on('update-downloaded', () => {
  console.log('Update downloaded!')
  dialog.showMessageBox(null, {
    type: 'question',
    buttons: ['Quit and install', 'Later'],
    message: 'Update downloaded!'
  }, response => {
    if (response === 0) {
      autoUpdater.quitAndInstall()
    }
  })
})
autoUpdater.on('download-progress', (info) => {
  const message = `Download speed: ${info.bytesPerSecond} - Downloaded ${info.percent}% (${info.transferred}/${info.total})`
  console.log(message)
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