(function () {
  'use strict'

  const fs = require('fs')
  const path = require('path')
  const xml2js = require('xml2js')
  const PouchDB = require('pouchdb-browser')

  let db = new PouchDB('lbc-feed-db')
  let xmlFiles = ['guangming', 'nanfangdaily', 'sichuan'].map(xml => {
    return path.join('assets', xml) + '.xml'
  })

  db.get('init').then(_ => {
    console.log('cache hit!')
    db.get('news:051l^200601202310013(S:196125026)').then(val => {
      console.log(val)
    })
  }).catch(_ => {
    console.log('initializing database...')
    loadXMLs(xmlFiles).then(_ => { console.log('loadXMLs ok') })
  })

  // Load XML files.
  function loadXMLs (xmls) {
    return new Promise(resolve => {
      db.put({ _id: 'init' }).then(_ => {
        let xmlsPromises = xmls.reduce((chain, xml) => {
          return chain.then(_ => new Promise(resolve => {
            parseXMLSync(xml, resolve)
          }))
        }, Promise.resolve())

        xmlsPromises.then(_ => { resolve() })
      })
    })
  }

  function parseXMLSync (xml, cb) {
    let parser = new xml2js.Parser()
    let data = fs.readFileSync(xml)

    parser.parseString(data, (err, result) => {
      if (err) return console.error(err)

      let newsArray = result.ArrayOfNewsData.NewsData
      console.log(newsArray.length)

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
      url: news.Url[0],
      press: news.Location[0]
    }).then(msg => { cb() }).catch(err => { console.error(err) })
  }
})()
