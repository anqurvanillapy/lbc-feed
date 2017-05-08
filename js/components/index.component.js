(function () {
  'use strict'

  const qs = require('querystring')

  /* Query options. */
  let options = {
    include_docs: true,
    limit: 10,
    skip: 1
  }

  /* Filters and results. */
  let newsArray = []
  let filterTags = []

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
        newsArray.push(
          `<section class="news-item">
            <h1>
              <a href="item.html?${qs.stringify({id: news.id})}">
                ${news.doc.title}
              </a>
            </h1>
            <p>${news.doc.press} <code>${news.doc.date}</code></p>
            <p>${news.doc.tags.map(t => {
              return `<a class="news-item__tags" href="#">${t}</a>`
            }).join(' ')}</p>
          </section>`)
      })

      render('news-list', newsArray.join(''))
    })
  }

  db.allDocs({ limit: 0 }).then(res => {
    let statusbar =
    `<li>共为您找到 ${res.total_rows - 1} 条新闻</li>
    <li>
      <span>当前筛选: </span>
      <span>${(filterTags.length > 0) ? filterTags : '无'}</span>
    </li>`

    let indexMenu =
    `<p style="color: #fff; padding: .5em; margin: 0;">新闻分类</p>
    <div>
      <ul>
        <li>全选</li>
        <li>反选</li>
        <li>报纸类别</li>
        <li>新闻类型</li>
        <li>报道主题</li>
        <li>报道主题</li>
        <li>新闻报道消息来源</li>
        <li>媒介形象呈现</li>
      </ul>
    </div>`

    nextPage()
    renderAll({
      'main-statusbar': statusbar,
      'menu__nav': indexMenu
    })
  }).catch(err => { console.error(err) })

  /* Listeners. */
  document.getElementById('more-button').addEventListener('click', nextPage)
})()
