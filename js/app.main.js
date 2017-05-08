const PouchDB = require('pouchdb-browser')

let db = new PouchDB('lbc-feed-db')

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
