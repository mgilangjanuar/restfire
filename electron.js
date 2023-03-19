const { app, BrowserWindow } = require('electron')
const { generate } = require('shortid')

const { server } = require('./server')

let win

// autoUpdater.setFeedURL({
//   provider: 'generic',
//   url: 'https://lang-updater.herokuapp.com/download/latest'
// })
// autoUpdater.on('checking-for-update', () => win.webContents.executeJavaScript(`console.log('checking update...')`))
// autoUpdater.on('update-available', info => {
//   win.webContents.executeJavaScript(`console.log('v${info.version} released and will downloading in background...')`)
// })
// autoUpdater.on('error', error => {
//   win.webContents.executeJavaScript(`console.error(${error})`)
// })
// autoUpdater.on('update-downloaded', () => {
//   win.webContents.executeJavaScript(`console.log('Update downloaded!')`)
//   dialog.showMessageBox(null, {
//     type: 'question',
//     buttons: ['Quit and install', 'Cancel'],
//     message: 'Install update?',
//     detail: 'Update available and ready to install.'
//   }, response => {
//     if (response === 0) {
//       autoUpdater.quitAndInstall()
//     }
//   })
// })
// autoUpdater.on('download-progress', (info) => {
//   const message = `Download speed: ${info.bytesPerSecond} - Downloaded ${info.percent}% (${info.transferred}/${info.total})`
//   win.webContents.executeJavaScript(`console.log('${message}')`)
// })

app.on('ready', () => {
  win = new BrowserWindow({
    icon: `${__dirname}/icon.png`,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.webContents.executeJavaScript(`if (window.localStorage.getItem('download-token')) window.localStorage.setItem('download-token', '${generate()}')`)
  win.maximize()
  win.loadURL('http://localhost:4002/app')
  // setTimeout(() => {
  //   autoUpdater.checkForUpdatesAndNotify()
  // }, 2000)
})

app.on('before-quit', () => {
  server.close()
  process.exit(0)
})