(function () {
  'use strict'

  // allDocs options.
  let options = {
    include_docs: true,
    limit: 10,
    skip: 1
  }

  let newsArray = []

  function fetchNextPage () {
    return new Promise((resolve, reject) => {
      db.allDocs(options).then(res => {
        if (res && res.rows.length > 0) {
          // Pagination.
          options.startkey = res.rows[res.rows.length - 1].id
          resolve(res.rows)
        } else {
          reject()
        }
      })
    })
  }

  function nextPage () {
    fetchNextPage().then(page => {
      page.forEach(news => {
        newsArray.push(`<section class="news-item">
          <h1><a href="item.html">${news.doc.title}</a></h1>
          <p>This is fine.</p>
        </section>`)
      })

      render('news-list', newsArray.join(''))
    })
  }

  let statusbar =
  `<li>共为您找到 ${(() => { return 100 })()} 条新闻.</li>`

  let indexMenu =
  `<nav>
    <ul>
      <li>Hello</li>
    </ul>
  </nav>`

  nextPage()  // first fetch
  renderAll({
    'main-statusbar': statusbar,
    'menu__nav': indexMenu
  })

  /* Listeners. */
  document.getElementById('more-button').addEventListener('click', nextPage)
})()
