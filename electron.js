const { app, BrowserWindow } = require('electron')
const { autoUpdater } = require("electron-updater")

require('./server')

app.on('ready', () => {
  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'mgilangjanuar',
    repo: 'restfire',
    token: '9589c5fa66de4dbe15663ef6aac16793380eb714'
  })
  autoUpdater.checkForUpdatesAndNotify()

  const win = new BrowserWindow({
    icon: `${__dirname}/icon.png`
  })

  win.maximize()

  win.loadURL('http://localhost:4002/app')
})