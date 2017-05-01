'use strict'

const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const xml2js = require('xml2js')
var levelup = require('levelup')

let win

let xmls = ['guangming', 'nanfangdaily', 'sichuan'].map(xml => {
  return path.join('assets', xml) + '.xml'
})

let urls = ['splash.html', 'index.html'].map(v => {
  return url.format({
    pathname: path.join(__dirname, v),
    protocol: 'file:',
    slashes: true
  })
})

var db = levelup('./lbc-feed-db')

function createWindow () {
  win = new BrowserWindow({ width: 800, height: 600 })

  win.loadURL(urls[0])
  setTimeout(_ => {
    db.get('init')
    loadXML(xmls)
    win.loadURL(urls[1])
  }, 500)

  // TODO: Check if it is inited.
  // db.get('news:23lh^200601161410077(S:193916305)', (err, val) => {
  //   if (err) return console.error(err)
  //   console.log(val)
  // })

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
  xmls.forEach(xml => {
    let parser = new xml2js.Parser()
    let data = fs.readFileSync(xml)
    parser.parseString(data, (err, result) => {
      if (err) { console.error(err) }

      // result.ArrayOfNewsData.NewsData.forEach() would raise errors.
      for (let i = 0; i < result.length; ++i) {
        db.put(result[i]['ID'], {
          title: result[i]['Title'],
          date: result[i]['Date'],
          tags: [],
          url: result[i]['Url'],
          press: result[i]['Location']
        }, {
          sync: true,
          valueEncoding: 'json'
        }, err => { return console.error('db error: ' + err) })
      }
    })
  })
}
