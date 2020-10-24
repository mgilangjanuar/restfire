const { app, BrowserWindow, autoUpdater } = require('electron')
const os = require('os')
// const { autoUpdater } = require('electron-updater')

require('./server')

// autoUpdater.logger = require('electron-log')
// autoUpdater.logger.transports.file.level = 'info'

const version = app.getVersion()
const platform = os.platform() + '_' + os.arch()
autoUpdater.setFeedURL({
  // provider: 'generic',
  url: `http://lang-updater.herokuapp.com/update/${platform}/${version}`
})
autoUpdater.on('checking-for-update', () => console.log('checking update'))
autoUpdater.on('update-available', () => console.log('update ready!'))
autoUpdater.on('error', error => console.error(error))
autoUpdater.on('update-downloaded', event => {
  console.log(event)
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  autoUpdater.checkForUpdates()

  const win = new BrowserWindow({
    icon: `${__dirname}/icon.png`
  })

  win.maximize()

  win.loadURL('http://localhost:4002/app')
})