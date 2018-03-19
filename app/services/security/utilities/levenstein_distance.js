
module.exports = suggestDictionary

function suggestDictionary (dict, opts) {
  opts = opts || {}
  var threshold = opts.threshold || 0.5
  return function suggest (word) {
    var length = word.length
    return dict.reduce(function (result, dictEntry) {
      var score = distance(dictEntry, word)
      if (score / length < threshold) {
        // console.log('suggestDictionary', word, (score / length).toFixed(3), dictEntry)
        result.push([score, dictEntry])
      }
      return result
    }, [])
    .sort((a, b) => Math.sign(a[0], b[0]))
    .map(a => a[1])
  }
}

function distance (a, b) {
  var table = [], diag = 0, left, top
  if (a.length === 0 || b.length === 0) return Math.max(a.length, b.length)
  for (var ii = 0, ilen = a.length + 1; ii !== ilen; ++ii) {
    for (var jj = 0, jlen = b.length + 1; jj !== jlen; ++jj) {
      if (ii === 0 || jj === 0) table[jj] = Math.max(ii, jj)
      else {
        diag += Number(a[ii - 1] !== b[jj - 1])
        left = table[jj - 1] + 1
        top = table[jj] + 1
        table[jj] = Math.min(left, top, diag)
        diag = top - 1
      }
    }
  }
  return table[b.length]
}

suggestDictionary.distance = distance