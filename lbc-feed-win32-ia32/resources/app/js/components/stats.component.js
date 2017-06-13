'use strict'

const Chart = require('chart.js')
const params = qs.parse(window.location.search.slice(1))
const username = params.username

if (!username) { throw new Error('hey you are not even logged in!') }

/* Components. */
const loader = document.getElementById('loader')
const chartCanvas = '<canvas id="charts-ctx"></canvas>'

let keyTag = qs.parse(window.location.search.slice(1)).selected

function createChart (stats) {
  // Extract the stats with keyTag.
  let chartLabels = []
  let chartData = []

  Object.keys(stats).forEach(k => {
    if (k.indexOf(keyTag) !== -1) {
      chartLabels.push(k)
      chartData.push(stats[k])
    }
  })

  // Done, render the chart.
  loader.hidden = true
  render('charts', chartCanvas)
  let ctx = document.getElementById('charts-ctx').getContext('2d')
  let chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: chartLabels,
      datasets: [{
        label: chartLabels,
        data: chartData
      }]
    }
  })
}

if (keyTag) {
  // Start the stats.
  console.log('collecting data...')
  loader.hidden = false

  db.get('stats').then(doc => {
    createChart(doc)
  }).catch(_ => {
    // No stats found, create an empty one.
    let _stats = {}
    Object.keys(TAGSTBL).forEach(k => { _stats[k] = 0 })
    createChart(_stats)
  })
}

renderAll({
  'header': header,
  'menu__nav-form': keyTagsForm,
  'loader': spinner
})
renderHeaderLinks(username)

/* Listeners. */
document.getElementById('submitTags').addEventListener('click', _ => {
  const t = document.querySelector('form').stats.value
  window.location.replace(`stats.html?${qs.stringify({
    selected: t,
    username: username
  })}`)
})
