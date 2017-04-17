const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const xml2js = require('xml2js')
const levelup = require('levelup')

let win

let xmls = ['guangming', 'nanfangdaily', 'sichuan'].map(xml => {
  return path.join('resources', xml) + '.xml'
})

let urls = ['splash.html', 'index.html'].map(v => {
  return url.format({
    pathname: path.join(__dirname, v),
    protocol: 'file:',
    slashes: true
  })
})

// TODO: npm install leveldown.
let db = levelup('./lbc-feed-db')

function createWindow () {
  win = new BrowserWindow({ width: 800, height: 600 })

  win.loadURL(urls[0])
  loadXML(xmls).then(_ => {
    setTimeout(_ => {
      win.loadURL(urls[1])
    }, 2000)
  })

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

// Load XML files.
function loadXML (xmls) {
  return new Promise(resolve => {
    xmls.map(xml => {
      let parser = new xml2js.Parser()
      let data = fs.readFileSync(xml)
      parser.parseString(data, (err, result) => {
        if (err) { console.error(err) }
      // TODO: Parse XML files to update news items in database every boot.
        console.dir(result)
      })
    })
    resolve()
  })
}
