'use strict'

const xml2js = require('xml2js')
const { dialog } = require('electron').remote

/* Paths. */

let [login, index] = ['login', 'index'].map(p => url.format({
  pathname: `${path.join(__dirname, p)}.html`,
  protocol: 'file:',
  slashes: true
}))

/* Entry point. */

let xmls
let isXML = f => path.extname(f) === '.xml'

try {
  xmls = new Set(fs.readdirSync(PROFILE_DIR_PATH).filter(isXML))
  console.log(xmls)
} catch (e) {
  console.error(e)
  // window.location.replace(login)
}

document.body.classList.add('active') // fade-in
updateXMLList()

/* Components. */

let errmsg = document.getElementById('errmsg')
const loadingView =
  `<div id="subdonebar"><div id="subdone"></div></div>
  <p id="totalbar" style="color: #999; font-family: monospace">
    Loading...
    <span id="done">0</span> / <span id="total"></span>
  </p>`

// Progressbar component.
let subtotal, subdone
let total, done
subtotal = subdone = total = done = 0
let totalSpan, doneSpan, subdoneDiv, totalBar

/* Listeners. */

document.getElementById('import-button').addEventListener('click', _ => {
  let files = dialog.showOpenDialog({ properties: ['multiSelections'] })

  if (!files) return
  if (!files.every(isXML)) {
    errmsg.textContent = '请导入 XML 文件!'
    return
  }

  errmsg.textContent = ''
  updateXMLList(files)
})

document.getElementById('index-button').addEventListener('click', _ => {
  let xmlArray = [...xmls]
  if (xmlArray.length) {
    console.log(xmlArray)

    // Updates loading views.
    document.body.removeChild(document.getElementById('import-list'))
    render('loading', loadingView)
    ;[totalSpan, doneSpan, subdoneDiv, totalBar] = [
      'total',
      'done',
      'subdone',
      'totalbar'
    ].map(id => { return document.getElementById(id) })

    db.get('xmls').then(doc => {
      let _xmls = new Set(doc.data)
      let diff = xmlArray.filter(x => !_xmls.has(path.basename(x)))
      total = diff.length

      if (total) {
        totalSpan.textContent = total

        db.put({
          _id: doc._id,
          _rev: doc._rev,
          data: xmlArray.map(f => path.basename(f))
        }).then(_ => {
          console.log('Updating database...')
          loadXMLs(diff).then(_ => {
            console.log('New XMLs updated...')
            cpXMLs(diff).then(_ => {
              redirect()
            })
          })
        })
      } else {
        console.log('cache hit!')
        subdone = subtotal = 1
        updateSubdone()
        redirect()
      }
    }).catch(_ => {
      total = xmlArray.length
      totalSpan.textContent = total

      console.log('Initializing database...')
      db.put({
        _id: 'xmls',
        data: xmlArray.map(f => path.basename(f))
      }).then(_ => {
        loadXMLs(xmlArray).then(_ => {
          console.log('Initial XMLs imported...')
          cpXMLs(xmlArray).then(_ => {
            redirect()
          })
        })
      })
    })
  } else {
    errmsg.textContent = '请添加至少一个 XML 文件!'
  }
})

/* Views updating. */

function updateXMLList (files) {
  let xmlList = document.getElementById('xml-list')
  xmlList.innerHTML = ''  // first wipe out the content

  if (files) {
    files.forEach(f => {
      if (!xmls.has(path.basename(f))) xmls.add(f)
    })
  }

  ;[...xmls.values()].forEach(f => {
    xmlList.insertAdjacentHTML('beforeend', `<li>${path.basename(f)}</li>`)
  })
}

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
    if (!newsArray) {
      totalSpan.textContent = --total
      cb()
    }

    subdone = 0
    subtotal = newsArray.length

    let newsPromises = newsArray.reduce((chain, news) => {
      return chain.then(_ => new Promise(resolve => {
        putItemSync(news, resolve)
      }))
    }, Promise.resolve())

    newsPromises.then(_ => {
      cb()
      updateDone()
    })
  })
}

function putItemSync (news, cb) {
  db.put({
    _id: news.ID[0],
    title: news.Title[0],
    date: news.Date[0],
    tags: {$$$: []},
    url: news.TrueUrl[0] || '',
    press: news.Location[0],
    content: news.EncodedContent[0] || ''
  }).then(_ => {
    updateSubdone()
    cb()
  }).catch(err => { console.error(err) })
}

/* Progressbar */

function updateDone () {
  doneSpan.textContent = ++done
}

function updateSubdone () {
  subdoneDiv.style.width = subdone++ / subtotal * 100 + '%'
}

/* Copy XMLs to profile directory and redirect to index. */

function cpXMLs (files) {
  return new Promise((resolve, reject) => {
    let pfiles = files.map(f => new Promise((res, rej) => {
      fs.createReadStream(f)
        .pipe(
          fs.createWriteStream(
            path.join(PROFILE_DIR_PATH, path.basename(f))
          )
        )

      res()
     }))

    Promise.all(pfiles).then(_ => { resolve() })
  })
}

function redirect () {
  db.createIndex({index: {fields: ['tags']}}).then(_ => {
    totalBar.innerHTML = 'Welcome :)'
    setTimeout(_ => {
      window.location.replace(index)
    }, 800)
  })
}
