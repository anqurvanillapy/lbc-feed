'use strict'

const Chart = require('chart.js')

/* Components. */
const loader = document.getElementById('loader')

let keyTag = qs.parse(window.location.search.slice(1)).selected

if (keyTag) {
  // Start the stats.
  console.log('collecting data...')
  loader.hidden = false
}

renderAll({
  'header': header,
  'menu__nav-form': keyTagsForm,
  'loader': spinner
})

/* Listeners. */
document.getElementById('submitTags').addEventListener('click', _ => {
  const t = document.querySelector('form').stats.value
  window.location.replace(`stats.html?${qs.stringify({selected: t})}`)
})
