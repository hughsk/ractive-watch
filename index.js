var Observer = require('observe-js').PathObserver
var clone    = require('clone')
var uniq     = require('uniq')

module.exports = watch

function watch(ractive) {
  var deps  = extractTemplateVariables(ractive)
  var model = clone(ractive.data)

  deps.forEach(function(path) {
    var observer = new Observer(model, path)

    observer.open(function(newval, oldval) {
      ractive.set(path, newval)
    })
  })

  return model
}

function extractTemplateVariables(ractive) {
  return uniq([]
    .concat(Object.keys(ractive.viewmodel.deps.default))
    .concat(Object.keys(ractive.viewmodel.deps.computed))
    .filter(function(key) {
      return !/^\$\{[^}]+}$/.test(key)
    })
    .map(function(key) {
      return key.split('.')
    })
    .reduce(function(list, keys) {
      for (var i = 0; i < keys.length; i++) {
        list.push(keys.slice(0, i + 1))
      } return list
    }, []).sort(function(a, b) {
      return a.length - b.length
    }).map(function(key) {
      return key.join('.')
    })
  )
}
