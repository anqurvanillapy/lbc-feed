(function () {
  'use strict'

  const qs = require('querystring')

  let id = qs.parse(window.location.search.slice(1)).id

  db.get(id).then(news => {
    let newspage =
    `<div style="width: 100%; height: 100%; padding: 0 .5em;">
      <nav>
        <span style="color: #888;">当前分类: </span>
        <ul id="news-page__tags">${news.tags}</ul>
      </nav>
      <h1 id="news-page__title" style="margin: 0;">${news.title}
        <small>${news.deleted ? '不感兴趣' : ''}</small>
      </h1>
      <section>
        <p id="news-page__attr" style="color: #888; margin-right: 1em;">
          ${news.press} <code>${news.date}</code>
        </p>
        <p><code id="news-page__url">${news.url}</code></p>
      </section>
      <iframe src="${news.url || '404.html'}" style="width: 100%; height: 66%;"></iframe>
    </div>`
    // TODO: Search on Bing for empty URL.

    let newsMenu =
    `<p style="color: #fff; padding: .5em; margin: 0;">新闻分类</p>
    <div>
      <ul>
        <li>报纸类别</li>
        <li>新闻类型</li>
        <li>报道主题</li>
        <li>报道主题</li>
        <li>新闻报道消息来源</li>
        <li>媒介形象呈现</li>
      </ul>
    </div>`

    renderAll({
      'news-page': newspage,
      'menu__nav': newsMenu
    })
  }).catch(err => { console.error(err) })
})()
