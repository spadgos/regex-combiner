var ender = '***',
    groupers = {
      '{': '}',
      '[': ']',
      '(': ')'
    },
    modifiers = '*?+';

module.exports = combineRegexes;

function combineRegexes(arr) {
  var trie = {};
  arr.map(reToString).forEach(setDeep, trie);
  compress(trie);
  return trieToRegex(trie);
}

function reToString(regex) {
  if (typeof regex === 'string') return regex;
  var str = regex.toString();
  return str.substring(1, str.length - 1).replace(/\\\//g, '/');
}

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
  return out;
}

function setDeep(str) {
  tokenize(str).reduce(function (memo, char, ind, arr) {
    if (!memo[char]) {
      memo[char] = {};
    }
    if (ind === arr.length - 1) {
      memo[char][ender] = true;
    }
    return memo[char];
  }, this);
}

function compress(trie) {
  Object.keys(trie).forEach(function (key) {
    var subtrie = trie[key],
        subkeys;
    compress(subtrie);
    subkeys = Object.keys(subtrie);
    if (subkeys.length === 1) {
      trie[key + subkeys[0]] = subtrie[subkeys[0]];
      delete trie[key];
    }
  });
}

function trieToRegex(trie) {
  return new RegExp(trieToRegexStr(trie));
}

function trieToRegexStr(trie) {
  var keys = Object.keys(trie);
  if (keys.length === 0) {
    return '';
  }
  return '(?:' + keys.map(function (key) {
    if (key.substr(-3) === ender) {
      return key.substr(0, key.length - 3);
    } else {
      return key + trieToRegexStr(trie[key]);
    }
  }).join('|') + ')';
}
