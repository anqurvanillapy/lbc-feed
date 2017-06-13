'use strict'

const { dialog } = require('electron').remote

/* Profile. */

const params = qs.parse(window.location.search.slice(1))
const username = params.username

/* Paths. */

let [login, index] = ['login', 'index'].map(p => url.format({
  pathname: `${path.join(__dirname, p)}.html`,
  protocol: 'file:',
  slashes: true
}))

/* Entry point. */

let xmls, _xmls
let isXML = f => path.extname(f) === '.xml'

try { fs.mkdirSync(PROFILE_DIR_PATH) } catch (e) { /* nop */ }

try {
  xmls = new Set(fs.readdirSync(PROFILE_DIR_PATH).filter(isXML))
  _xmls = new Set([...xmls.values()]) // Set is mutable
  console.log(xmls)
} catch (e) {
  console.error(e)
}

document.body.classList.add('active') // fade-in
updateXMLList()

/* Components. */

let errmsg = document.getElementById('errmsg')

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
  let i = 0

  if (xmlArray.length) {
    let diff = xmlArray.filter(x => !_xmls.has(path.basename(x)))

    console.log(xmlArray)
    console.log(_xmls)
    console.log(diff)
    if (diff.length) cpXMLs(diff)
    document.getElementById('import-list').classList.add('active')

    let fakeProgress = setInterval(_ => {
      render('import-list', `<h1>${++i} %<h1>`)

      if (i === 100) {
        clearInterval(fakeProgress)
        render('import-list', `<h1>${i} % √<h1>`)
        setTimeout(_ => {
          window.location.replace(`${index}?username=${username}`)
        }, 800)
      }
    }, 5)

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

/* Copy XMLs to profile directory and redirect to index. */

function cpXMLs (files) {
  return new Promise((resolve, reject) => {
    let pfiles = files.map(f => new Promise((resolve, reject) => {
      fs.createReadStream(f)
        .pipe(
          fs.createWriteStream(
            path.join(PROFILE_DIR_PATH, path.basename(f))
          )
        )

      resolve()
    }))

    Promise.all(pfiles).then(_ => { resolve() })
  })
}
