'use strict'

const xml2js = require('xml2js')

/* Components. */
const moreButton = document.getElementById('more-button')
const loader = document.getElementById('loader')

/* Filters and results. */
const params = qs.parse(window.location.search.slice(1))
const username = params.username
const query = params.q

if (!username) { throw new Error('hey you are not even logged in!') }

let newsArray = []
let filterTags = (query) ? query.split(',') : []
const is$$$ = filterTags.includes('$$$')
console.log(filterTags)

/* Query options for db.find. */
let options = {
  selector: {
    _id: {$gt: null},  // _id for pagination
    deleted: false
  },
  sort: ['_id'],
  limit: 10
}

function fetchNextPage () {
  return new Promise((resolve, reject) => {
    // Query deleted news?
    options.selector.deleted = filterTags.includes('deleted')

    // Query superuser?
    let si = filterTags.indexOf('$$$')
    let user = (si > -1) ? '$$$' : username
    filterTags.splice(si, !!(si > -1) * 1)

    if (filterTags.length > 0 && !options.selector.deleted) {
      options.selector[`tags.${user}`] = {$in: filterTags}
    }

    db.find(options).then(res => {
      if (res && res.docs.length > 0) {
        options.selector._id.$gte = res.docs[res.docs.length - 1]._id
        resolve(res.docs)
      } else resolve([])
    })
  })
}

function nextPage () {
  fetchNextPage().then(page => {
    loader.hidden = true
    if (!page.length) moreButton.hidden = true

    page.forEach(news => {
      news = news.doc || news
      let tags = (is$$$) ? news.tags['$$$'] : news.tags[username] || []
      let tc = (is$$$) ? 'style="color: crimson;"' : ''  // tag color

      // Href: item ID and previous queried tags.
      newsArray.push(
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
          <p>${tags.map(t => {
            return `<a class="news-item__tags" ${tc} href="#">${TAGSTBL[t]}</a>`
          }).join('')}</p>
        </section>`)
    })

    renderAll({
      'news-list': newsArray.join(''),
      'username': username
    })
    renderHeaderLinks(username)
    setTopicConstraint()
  })
}

// TODO: stats.
db.allDocs({ limit: 0 }).then(res => {
  let statusbar =
  `<li>共为您找到 ${res.total_rows - 1} 条新闻</li>
  <li>
    <span>当前筛选: </span>
    <span>${
      (filterTags.length > 0 && !is$$$) ? filterTags.map(t => TAGSTBL[t]) : '无'
    }</span>
  </li>`

  nextPage()
  render('main-statusbar', statusbar)
})

renderAll({
  'header': header,
  'menu__nav-form': allTagsForm,
  'loader': spinner
})

/* Listeners. */
document.getElementById('more-button').addEventListener('click', nextPage)
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
