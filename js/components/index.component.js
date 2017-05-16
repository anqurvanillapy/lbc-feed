(function () {
  'use strict'

  const qs = require('querystring')

  /* Filters and results. */
  let newsArray = []
  let params = qs.parse(window.location.search.slice(1))
  let filterTags = Object.values(params) || []
  console.log(filterTags)

  /* Query options, for db.allDocs and db.find. */
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
      options.selector.deleted = filterTags.includes('true')  // deleted
      if (filterTags.length > 0) options.selector.tags = {$in: filterTags}
      db.find(options).then(res => {
        if (res && res.docs.length > 0) {
          options.selector._id.$gte = res.docs[res.docs.length - 1]._id
          resolve(res.docs)
        }
      })
    })
  }

  function nextPage () {
    fetchNextPage().then(page => {
      page.forEach(news => {
        news = news.doc || news
        newsArray.push(
          `<section class="news-item">
            <h1>
              <a href="item.html?${qs.stringify({id: news._id})}">
                ${news.title}
              </a>
            </h1>
            <p>${news.press} <code>${news.date}</code></p>
            <p>${news.tags.map(t => {
              return `<a class="news-item__tags" href="#">${TAGSTBL[t]}</a>`
            }).join('')}</p>
          </section>`)
      })

      render('news-list', newsArray.join(''))
    })
  }

  // TODO: stats.
  db.allDocs({ limit: 0 }).then(res => {
    let statusbar =
    `<li>共为您找到 ${res.total_rows - 1} 条新闻</li>
    <li>
      <span>当前筛选: </span>
      <span>${(filterTags.length > 0) ? filterTags.map(t => {
        return TAGSTBL[t]
      }) : '无'}</span>
    </li>`

    nextPage()
    render('main-statusbar', statusbar)
  }).catch(err => { console.error(err) })

  /* Listeners. */
  document.getElementById('more-button').addEventListener('click', nextPage)
  document.getElementById('submitTags').addEventListener('click', _ => {
    let tagsForm = new FormData(document.querySelector('form'))

    for (let [_, v] of tagsForm.entries()) {
      filterTags.push(v)
    }

    window.location.replace(`index.html?${qs.stringify(filterTags)}`)
  })
})()
