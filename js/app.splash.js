(function () {
  'use strict'

  const fs = require('fs')
  const path = require('path')
  const url = require('url')
  const xml2js = require('xml2js')
  let PouchDB = require('pouchdb-browser')

  /* Data. */
  PouchDB.plugin(require('pouchdb-find'))
  let db = new PouchDB('lbc-feed-db')
  let xmlFiles = ['guangming', 'nanfangdaily', 'sichuan'].map(xml => {
    return path.join('assets', xml) + '.xml'
  })

  /* Progressbar component. */
  let done
  let total = 0
  let subtotal
  let [progress, subprogress, loading] = [
    'progress',
    'subprogress',
    'loading'
  ].map(id => { return document.getElementById(id) })

  /* Index path. */
  let index = url.format({
    // pathname: `${path.join(__dirname, 'index')}.html`,
    pathname: `${path.join(__dirname, 'login')}.html`,
    protocol: 'file:',
    slashes: true
  })

  /* Entry point. */
  db.info().then(res => {
    if (res.doc_count) {
      console.log('cache hit')
      done = total = subtotal = 2
      updateSubprogress()
      updateProgress()
      redirect()
    } else {
      console.log('initializing database...')
      loadXMLs(xmlFiles).then(_ => {
        console.log('loadXMLs ok')
        redirect()
      })
    }
  })

  /* Load XML files. */
  function loadXMLs (xmls) {
    return new Promise(resolve => {
      let xmlsPromises = xmls.reduce((chain, xml) => {
        return chain.then(_ => new Promise(resolve => {
          parseXMLSync(xml, resolve)
        }))
      }, Promise.resolve())

      xmlsPromises.then(_ => { resolve() })
    })
  }

  function parseXMLSync (xml, cb) {
    let parser = new xml2js.Parser()
    let data = fs.readFileSync(xml)

    parser.parseString(data, (err, result) => {
      if (err) return console.error(err)

      let newsArray = result.ArrayOfNewsData.NewsData
      done = 0
      subtotal = newsArray.length
      updateProgress()

      let newsPromises = newsArray.reduce((chain, news) => {
        return chain.then(_ => new Promise(resolve => {
          putItemSync(news, resolve)
        }))
      }, Promise.resolve())

      newsPromises.then(_ => { cb() })
    })
  }

  function putItemSync (news, cb) {
    db.put({
      _id: news.ID[0],
      title: news.Title[0],
      date: news.Date[0],
      tags: [],
      url: news.TrueUrl[0] || '',
      press: news.Location[0],
      content: news.EncodedContent[0] || '',
      deleted: false
    }).then(_ => {
      updateSubprogress()
      cb()
    }).catch(err => { console.error(err) })
  }

  /* Progressbar */
  function updateProgress () {
    progress.textContent = ++total
  }

  function updateSubprogress () {
    subprogress.style.width = done++ / subtotal * 100 + '%'
  }

  /* Redirect to index. */
  function redirect () {
    db.createIndex({index: {fields: ['tags', 'deleted']}}).then(_ => {
      loading.innerHTML = 'Welcome :)'
      setTimeout(_ => {
        window.location.replace(index)
      }, 1000)
    })
  }
})()
