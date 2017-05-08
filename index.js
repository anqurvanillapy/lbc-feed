'use strict'

const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

let win
let splash = url.format({
  pathname: `${path.join(__dirname, 'splash')}.html`,
  protocol: 'file:',
  slashes: true
})

function createWindow () {
  win = new BrowserWindow({ width: 800, height: 600 })
  win.loadURL(splash)
  win.webContents.openDevTools()
  win.on('closed', _ => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', _ => {
  // Applications and their menu bar may stay active on macOS.
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', _ => {
  // Re-create a window in the app when the dock icon is clicked and there are
  // no other windows open for macOS.
  if (win === null) createWindow()
})
