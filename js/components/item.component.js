(function () {
  'use strict'

  const qs = require('querystring')

  let id = qs.parse(window.location.search.slice(1)).id

  db.get(id).then(news => {
    let newspage =
    `<div style="width: 100%; height: 100%; padding: 0 .5em;">
      <p>${news.tags.map(t => {
        return `<a class="news-page__tags" href="#">${TAGSTBL[t]}</a>`
      }).join('')}</p>
      <h1 id="news-page__title" style="margin: 0;">${news.title}
        <small style="color: crimson;">${news.deleted ? '不感兴趣' : ''}</small>
      </h1>
      <section>
        <p id="news-page__attr" style="color: #888; margin-right: 1em;">
          ${news.press} <code>${news.date}</code>
        </p>
        <p>
          <input id="news-page__url" type="text" style="width: 100%;" value="${news.url}" disabled></input>
        </p>
      </section>
      <iframe src="${news.url}" style="width: 100%; height: 66%;"></iframe>
    </div>`

    render('news-page', newspage)

    /* Event listener. */
    document.getElementById('submitTags').addEventListener('click', _ => {
      let tagsForm = new FormData(document.querySelector('form'))
      let tags = []
      let deleted

      for (let [k, v] of tagsForm.entries()) {
        if (k === 'deleted' && v === 'true') deleted = true
        else tags.push(v)
      }

      db.get(id).then(doc => {
        return db.put({
          _id: id,
          _rev: doc._rev,
          title: doc.title,
          date: doc.date,
          url: doc.url,
          press: doc.press,
          content: doc.content,
          deleted: deleted || false,
          tags: tags
        }).then(_ => { window.location.reload(true) })
      }).catch(err => { console.err(err) })
    })
  }).catch(err => { console.error(err) })
})()
