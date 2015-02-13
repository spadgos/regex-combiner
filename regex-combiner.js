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
  var regexes  = arr.map(toRegex),
      combined = combineRegexes(regexes);

  /**
   * Get the index of the first source regex which matched.
   * @param  {String}
   * @return {Number} The index, or -1 if none found.
   */
  combined.indexOf = function (str) {
    return indexOf(combined, regexes, str);
  };
  combined.exec = function (str) {
    var index = indexOf(combined, regexes, str);
    return index > -1 ? regexes[index].exec(str) : null;
  };
  return combined;
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
