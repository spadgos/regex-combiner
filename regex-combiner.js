var combineRegexes = require('./lib/combine-regexes');

/**
 * Regex Combiner
 *
 * Accepts an array of RegExps (or Strings which will be converted to RegExp), and returns an object which can act upon
 * the regexes as a group.
 *
 * @param  {Array.<RegExp|String>} arr
 * @return {Object}
 */
module.exports = function (arr) {
  var regexes      = arr.map(toRegex),
      combined     = combineRegexes(regexes),
      indexOfBound = indexOf.bind(null, combined, regexes);
  return {
    /**
     * Test a string to see if any of the source regexes match the given string.
     * @param  {String}
     * @return {Boolean}
     */
    test: combined.test.bind(combined),

    /**
     * Get the index of the first source regex which matched.
     * @param  {String}
     * @return {Number} The index, or -1 if none found.
     */
    indexOf: indexOfBound,

    exec: function (str) {
      var index = indexOfBound(str);
      return index > -1 ? regexes[index].exec(str) : null;
    }
  };
};

function indexOf(combined, regexes, str) {
  if (combined.test(str)) {
    for (var i = 0; i < regexes.length; ++i) {
      if (regexes[i].test(str)) {
        return i;
      }
    }
  }
  return -1;
}

function toRegex(input) {
  return RegExp(input);
}
