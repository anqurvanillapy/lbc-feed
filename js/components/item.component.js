'use strict'

const params = qs.parse(window.location.search.slice(1))
console.log(params)
const prevQuery = params.q
const username = params.username
let id = params.id

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
        <button id="news-page__copy" type="button">复制链接</button>
        <code id="news-page__url">${news.url}</code>
      </p>
    </section>
    <iframe src="${news.url}" style="width: 100%; height: 66%;"></iframe>
  </div>`

  renderAll({
    'news-page': newspage,
    'header': header,
    'username': username,
    'menu__nav-form': allTagsForm
  })
  renderNav(news.deleted, news.tags)
  setTopicConstraint()
  renderLogoHref(username, prevQuery)

  /* Event listeners. */
  document.getElementById('submitTags').addEventListener('click', _ => {
    let tagsForm = new FormData(document.querySelector('form'))
    let tags = []
    let deleted

    // User must fill in all the blanks.
    const blanks = ['press', 'type', 'src', 'pubimg', 'edu']
    for (let ty of blanks) {
      if (!tagsForm.has(ty) && !tagsForm.has('deleted')) return
    }

    if (!tagsForm.has('deleted') &&
      !tagsForm.has('topic') &&
      !(tagsForm.has('topicHelp') && tagsForm.has('topicHelpBy'))) return

    // Previous stats.
    let prevStats = {}
    Object.keys(TAGSTBL).forEach(k => {
      if (news.tags.includes(k)) prevStats[k] = 1; else prevStats[k] = 0
    })
    prevStats.deleted = (news.deleted) ? 1 : 0  // override deleted count

    // Update the tags.
    for (let [k, v] of tagsForm.entries()) {
      // Once deleted, tags not available.
      if (k === 'deleted' && v === 'true') {
        deleted = true
        tags = []
        break
      } else tags.push(v)
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
      }).then(_ => {
        db.get('stats').then(doc => {
          // Update the stats.
          doc.deleted -= prevStats.deleted
          if (deleted) ++doc.deleted
          Object.keys(doc).forEach(k => {
            if (k === '_id' || k === '_rev' || k === 'deleted') return
            doc[k] -= prevStats[k]
            if (tags.includes(k)) ++doc[k]
          })

          return db.put(doc).then(_ => {
            window.location.reload(true)
          })
        }).catch(_ => {
          // No stats found, just create a new one.
          let _stats = {}
          Object.keys(TAGSTBL).forEach(k => {
            if (tags.includes(k)) _stats[k] = 1; else _stats[k] = 0
          })
          _stats.deleted = (deleted) ? 1 : 0
          _stats._id = 'stats'

          return db.put(_stats).then(_ => {
            window.location.reload(true)
          })
        })
      })
    })
  })

  document.getElementById('news-page__copy').addEventListener('click', _ => {
    copy(document.getElementById('news-page__url').textContent)
  })
})
