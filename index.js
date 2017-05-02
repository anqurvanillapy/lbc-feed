'use strict'

const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const xml2js = require('xml2js')
const levelup = require('levelup')

let xmls = ['guangming', 'nanfangdaily', 'sichuan'].map(xml => {
  return path.join('assets', xml) + '.xml'
})

let urls = ['splash', 'index'].map(v => {
  return url.format({
    pathname: `${path.join(__dirname, v)}.html`,
    protocol: 'file:',
    slashes: true
  })
})

let db = levelup('./lbc-feed-db')
let win

function createWindow () {
  win = new BrowserWindow({ width: 800, height: 600 })

  let splash = new Promise((resolve, reject) => {
    win.loadURL(urls[0])
    setTimeout(_ => {
      db.get('init', err => {
        // If key not found, the DB is not inited.
        if (err) {
          console.log('initiailizing DB...')
          loadXML(xmls)
        } else {
          console.log('cache hit!')
        }
      })
      resolve()
    }, 1000)
  })

  splash.then(_ => { win.loadURL(urls[1]) })
        .catch(reason => { return console.error(reason) })

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
  db.put('init', true, err => {
    if (err) return console.error(err)

    xmls.forEach(xml => {
      let parser = new xml2js.Parser()
      let data = fs.readFileSync(xml)

      parser.parseString(data, (err, result) => {
        if (err) return console.error(err)

        result.ArrayOfNewsData.NewsData.forEach(news => {
          console.log(...news.ID)
          db.put(...news.ID, {
            title: news.Title[0],
            date: news.Date[0],
            tags: [],
            url: news.Url[0],
            press: news.Location[0]
          }, { valueEncoding: 'json' }, err => {
            if (err) return console.error(err)
          })
        })
      })
    })
  })
}
