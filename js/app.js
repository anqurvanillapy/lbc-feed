'use strict'

/* Components rendering methods. */

// Rener single component.
function render (id, text) {
  document.getElementById(id).innerHTML = text
}

// Key: DOM id; Value: Component text.
function renderAll (comps) {
  Object.keys(comps).forEach(c => {
    document.getElementById(c).innerHTML = comps[c]
  })
}
