let Application = require('spectron').Application
let assert = require('assert')
let path = require('path')

describe('Application launch', function () {
  this.timeout(10000)

  beforeEach(function () {
    this.app = new Application({
      path: path.resolve(__dirname, '../node_modules/.bin/electron'),
      args: [path.resolve(__dirname, '../')]
    })

    return this.app.start()
  })

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('shows an initial window', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1)
    })
  })
})
