const levelup = require('levelup')
const assert = require('assert')

let db = levelup('../lbc-feed-db')

describe('App Init', _ => {
  it('should get a `init` key from DB', _ => {
    db.get('init', (err, val) => {
      if (err) return console.error(err)
      assert.equal(val, true)
    })
  })
})
