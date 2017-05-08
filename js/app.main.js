const PouchDB = require('pouchdb-browser')

/* Database instance. */
let db = new PouchDB('lbc-feed-db')

/* Tags table. */
// TODO
const TAGSTBL = {
  pressType: true,
  newsType: true,
  topic: true,
  newsSource: true,
  publicImage: true
}

/* Components rendering. */

// Render single component.
function render (id, text) {
  document.getElementById(id).innerHTML = text
}

// Key: DOM id; Value: Component text.
function renderAll (comps) {
  Object.keys(comps).forEach(c => {
    document.getElementById(c).innerHTML = comps[c]
  })
}
