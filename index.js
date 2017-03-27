const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

let win

function createWindow () {
  win = new BrowserWindow({ width: 800, height: 600 })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

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

// Rest of the app's main code.
