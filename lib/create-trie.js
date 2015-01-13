var END = '***',
    groupers = {
      '{': '}',
      '[': ']',
      '(': ')'
    },
    modifiers = '*?+';

module.exports = createTrie;

function createTrie(arr) {
  var trie = {};
  arr.forEach(setDeep, trie);
  return trie;
}
function setDeep(str) {
  tokenize(str).concat(END).reduce(tokenReducer, this);
}

function tokenReducer(memo, token) {
  return memo[token] || (memo[token] = {});
}

/**
 * Convert a regex into a series of tokens. A token in this context is something treated as a single unit, for example,
 * single characters, characters with modifiers, groups and character sets.
 *
 * tokenize('ab+(cd|ef)*[g-i]') -> ['a', 'b+', '(cd|ef)*', '[g-i]']
 *
 * @param  {String} str
 * @return {Array.<String>}
 */
function tokenize(str) {
  var i, l, char, out = [], currToken = '', closer;

  for (i = 0, l = str.length; i < l; ++i) {
    char = str.charAt(i);

    if (char === '\\') {
      currToken += char + str.charAt(++i);
    } else if (!closer && (closer = groupers[char])) {
      currToken = char;
    } else if (char === closer) {
      currToken += char;
      closer = null;
      if (char === '}') { // this group is a modifier
        out[out.length - 1] += currToken;
        currToken = '';
        continue;
      }
    } else if (modifiers.indexOf(char) > -1) {
      if (closer) {
        currToken += char;
      } else {
        out[out.length - 1] += char;
      }
      continue;
    } else {
      currToken += char;
    }
    if (!closer) {
      out.push(currToken);
      currToken = '';
    }
  }
  return out.map(convertToNonCapturingGroup);
}
function convertToNonCapturingGroup(token) {
  return token.replace(/^\(([^?].*\)(?:[+*]\??|\?|\{[0-9]*(?:,[0-9]*)?\})?)$/, '(?:$1');
}
