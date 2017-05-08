(function () {
  'use strict'

  let statusbar =
  `<li>共为您找到 ${(() => { return 100 })()} 条新闻.</li>`

  let newsItem =
  `<section class="news-item">
    <h1><a href="item.html">Hello, world!</a></h1>
    <p>This is fine.</p>
  </section>`

  let indexMenu =
  `<nav>
    <ul>
      <li>Hello</li>
    </ul>
  </nav>`

  let newsArray = []

  for (let i = 0; i < 2; ++i) newsArray.push(newsItem)

  renderAll({
    'main-statusbar': statusbar,
    'news-list': newsArray.join(''),
    'menu__nav': indexMenu
  })
})()
