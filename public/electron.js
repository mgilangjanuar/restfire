const { app, BrowserWindow } = require('electron')
const { autoUpdater } = require("electron-updater")

require('./server')

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify()

  const win = new BrowserWindow({
    icon: `${__dirname}/icon.png`
  })

  win.maximize()

  win.loadURL('http://localhost:4002/app')
})