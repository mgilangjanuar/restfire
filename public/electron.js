const { app, BrowserWindow } = require('electron')
const { autoUpdater } = require('electron-updater')
// const os = require('os')

require('./server')

// autoUpdater.logger = require('electron-log')
// autoUpdater.logger.transports.file.level = 'info'

// const version = app.getVersion()
// const platform = os.platform() + '_' + os.arch()
autoUpdater.setFeedURL({
  provider: 'generic',
  url: 'https://lang-updater.herokuapp.com/download/latest'
})
autoUpdater.on('checking-for-update', () => console.log('checking update'))
autoUpdater.on('update-available', () => console.log('update ready!'))
autoUpdater.on('error', error => console.error(error))
autoUpdater.on('update-downloaded', event => {
  console.log(event)
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify()
  }, 3000)

  const win = new BrowserWindow({
    icon: `${__dirname}/icon.png`
  })

  win.maximize()

  win.loadURL('http://localhost:4002/app')
})