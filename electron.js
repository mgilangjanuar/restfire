const { app, BrowserWindow } = require('electron')
require('./server')

app.on('ready', () => {
  const win = new BrowserWindow({
    icon: `${__dirname}/logo512.png`
  })

  win.maximize()

  win.loadURL('http://localhost:4002/app')
})