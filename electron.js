const { app, BrowserWindow, autoUpdater } = require('electron')
// const { autoUpdater } = require('electron-updater')

require('./server')

// autoUpdater.logger = require('electron-log')
// autoUpdater.logger.transports.file.level = 'info'

app.on('ready', () => {
  autoUpdater.setFeedURL({
    // provider: 'generic',
    url: 'https://lang-updater.herokuapp.com/download'
  })
  autoUpdater.on('checking-for-update', () => console.log('checking update'))
  autoUpdater.on('update-available', () => console.log('update ready!'))
  autoUpdater.on('update-downloaded', event => {
    console.log(event)
    autoUpdater.quitAndInstall()
  })
  autoUpdater.checkForUpdates()

  const win = new BrowserWindow({
    icon: `${__dirname}/icon.png`
  })

  win.maximize()

  win.loadURL('http://localhost:4002/app')
})