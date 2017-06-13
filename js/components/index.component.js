'use strict'

const xml2js = require('xml2js')

/* Paths. */

const index = url.format({
  pathname: `${path.join(__dirname, 'index')}.html`,
  protocol: 'file:',
  slashes: true
})

/* Components. */

const moreButton = document.getElementById('more-button')
const loader = document.getElementById('loader')

/* Filters and results. */

const params = qs.parse(window.location.search.slice(1))
const [
  username,
  query,
  currentXML
] = ['username', 'q', 'filename'].map(k => params[k])

let isTagged = window.location.hash.substr(1) === 'tagged'

if (!username) { throw new Error('hey you are not even logged in!') }

let filterTags = (query) ? query.split(',') : []
const is$$$ = filterTags.includes('$$$')
console.log(filterTags)

/* News XMLs. */

let XMLList, newsArray
let displayNews = []

try {
  XMLList = fs.readdirSync(PROFILE_DIR_PATH).filter(f =>
    path.extname(f) === '.xml'
  )
} catch (e) {
  throw new Error('user directory is deleted, please login again!')
}

if (currentXML && !XMLList.includes(currentXML)) {
  throw new Error('wrong XML filename!')
}

/* Templates. */

let filelist =
  `${XMLList.map(f =>
    `<a href="${index}?${qs.stringify({
      q: filterTags.join(),
      username: username,
      filename: f
    })}">${f}</a>`
  ).join(', ')}`

if (currentXML) {
  const parser = new xml2js.Parser()
  parser.parseString(
    fs.readFileSync(path.join(PROFILE_DIR_PATH, currentXML), 'utf8'),
    (err, result) => {
      if (err) throw err

      newsArray = result.ArrayOfNewsData.NewsData
      if (!newsArray) throw new Error('wrong XML news format!')
    })
} else newsArray = []

let statusbar =
  `<li>共为您找到 ${newsArray.length} 条新闻</li>
  <li>
    <span>当前筛选: </span>
    <span>${
      (filterTags.length > 0 && !is$$$) ? filterTags.map(t => TAGSTBL[t]) : '无'
    }</span>
  </li>`

renderAll({
  'main-statusbar': statusbar,
  'filelist': filelist,
  'header': header,
  'menu__nav-form': allTagsForm,
  'loader': spinner
})
nextPage(isTagged)
renderHeaderLinks(username)
setTopicConstraint()

/* Pagination. */

function fetchNextPage (isTagged = false) {
  console.log(newsArray.length)
  return new Promise((resolve, reject) => {
    if (isTagged) {
      resolve([])
    } else {
      let page = []
      for (let i = 0; newsArray.length && i < 10; ++i) {
        let news = newsArray.pop()
        page.push({
          id: news.ID[0],
          title: news.Title[0],
          date: news.Date[0],
          press: news.Location[0]
        })
      }
      resolve(page)
    }
  })
}

function nextPage (isTagged = false) {
  fetchNextPage(isTagged).then(page => {
    loader.hidden = true
    if (!page.length) moreButton.hidden = true

    page.forEach(news => {
      // let tags = (is$$$) ? news.tags['$$$'] : news.tags[username] || []
      // let tc = (is$$$) ? 'style="color: crimson;"' : ''  // tag color

      // Href: item ID and previous queried tags.
      displayNews.push(
        `<section class="news-item">
          <h1>
            <a href="item.html?${qs.stringify({
              username: username,
              id: news._id,
              q: filterTags
            })}">
              ${news.title}
            </a>
          </h1>
          <p>${news.press} <code>${news.date}</code></p>
        </section>`)
    })
        // <p>${tags.map(t => {
        //   return `<a class="news-item__tags" ${tc} href="#">${TAGSTBL[t]}</a>`
        // }).join('')}</p>
    render('news-list', displayNews.join(''))
  })
}

/* Listeners. */

document.getElementById('more-button').addEventListener('click', _ => {
  nextPage(isTagged)
})

document.getElementById('submitTags').addEventListener('click', _ => {
  const tagsForm = new FormData(document.querySelector('form'))

  // Clean out the query.
  filterTags.length = 0

  for (let [k, v] of tagsForm.entries()) {
    if (k === 'deleted' && v === 'true') {
      filterTags = ['deleted']
      break
    } else filterTags.push(v)
  }

  window.location.replace(
    `index.html?q=${filterTags.join()}&username=${username}`
  )
})
