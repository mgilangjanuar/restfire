const { app, BrowserWindow } = require('electron')
const { autoUpdater } = require('electron-updater')

require('./server')

autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = 'info'

app.on('ready', () => {
  autoUpdater.setFeedURL({
    provider: 'generic',
    url: 'https://lang-updater.herokuapp.com/download'
  })
  autoUpdater.checkForUpdatesAndNotify()

  const win = new BrowserWindow({
    icon: `${__dirname}/icon.png`
  })

  win.maximize()

  win.loadURL('http://localhost:4002/app')
})