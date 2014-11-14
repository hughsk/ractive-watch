var test  = require('tape')
var watch = require('./')

test('ractive-watch', function(t) {
  var Ractive = require('ractive')
  var ractive = new Ractive({
      template: '<p>{{hello}} {{test(world)}} {{world.again}} {{computed + 1}}</p>'
    , data: {
        hello: 'hello'
      , world: { again: 'world' }
      , computed: 2
    }
  })

  var model = watch(ractive)

  var init = false

  ractive.observe('world.again', function(newval, oldval, path) {
    if (!init) return init = true

    t.equal(newval, 'lorem', 'new: "lorem"')
    t.equal(oldval, 'world', 'old: "world"')
    t.equal(path, 'world.again', 'path: "world.again"')
    t.end()
  })

  model.world.again = 'lorem'

  // Object.observe not available in Node :(
  Platform.performMicrotaskCheckpoint()
})
