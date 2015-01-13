var _ = require('underscore');

module.exports = trieToRegex;

function trieToRegex(trie) {
  return RegExp(trieToRegexStr(trie));
}

function trieToRegexStr(trie) {
  var keys = Object.keys(trie),
      charSet, pre = '', post = '',
      parts, singleLeafTokens, others;

  if (keys.length === 0) {
    return '';
  }

  parts = _.partition(keys, isSingleLeafToken, trie);
  singleLeafTokens = parts[0];
  others = parts[1];

  if (singleLeafTokens.length > 1) {
    charSet = '[' + optimizeCharSet(singleLeafTokens.map(stripAndSanitize).join('')) + ']';
    if (others.length) {
      others.push(charSet);
    } else {
      return charSet;
    }
  } else {
    others = keys;
  }
  if (others.length > 1) {
    pre = '(?:';
    post = ')';
  }
  return pre + others.map(walk, trie).join('|') + post;
}
function walk(key) {
  return key + (this[key] ? trieToRegexStr(this[key]) : '');
}
function isSingleLeafToken(key) {
  return isSingleToken(key) && _.isEmpty(this[key]) && tokenCanBeInCharSet(key);
}
function isSingleToken(token) {
  return token.length === 1 || token[0] === '\\' || tokenIsCharSet(token);
}
function tokenIsCharSet(token) {
  return token[0] === '[';
}
function tokenCanBeInCharSet(token) {
  return '$^.'.indexOf(token) === -1;
}
function stripAndSanitize(token) {
  if (tokenIsCharSet(token)) {
    return token.substring(1, token.length - 1).replace(/^-|-$/g, '\\-');
  }
  if (token === '-') {
    return '\\-';
  }
  return token;
}
function optimizeCharSet(charSet) {
  var normalRange = /^[a-zA-Z0-9]-[a-zA-Z0-9]$/;
  return createRanges(_.chain(charSet.split(/((?:\\u[a-fA-F0-9]{4}|\\?.)(?:-(?:\\u[a-fA-F0-9]{4}|.))?)/))
    .filter(_.identity)
    .map(function (charOrRange) {
      if (normalRange.test(charOrRange)) {
        return _.range(charOrRange.charCodeAt(0), charOrRange.charCodeAt(2) + 1).map(function (i) { return String.fromCharCode(i); });
      }
      return charOrRange;
    })
    .flatten()
    .uniq()
    .sort()
    .value()
  ).replace(/^\\-|\\-$/, '-');
}
function createRanges(chars) {
  return chars.map(function (char, ind, arr) {
    if (char.length === 1 && ind && ind < arr.length - 1 && arr[ind - 1].charCodeAt(0) === arr[ind + 1].charCodeAt(0) - 2) {
      return '-';
    }
    return char;
  }).join('').replace(/--+/g, '-');
}
