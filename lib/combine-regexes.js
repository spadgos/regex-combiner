var compressTrie = require('./compress-trie'),
    createTrie   = require('./create-trie'),
    trieToRegex  = require('./trie-to-regex');

module.exports = combineRegexes;

function combineRegexes(regexes) {
  var trie = createTrie(regexes.map(regexToString));
  trie = compressTrie(trie);
  return trieToRegex(trie);
}

function regexToString(regex) {
  var str = regex.toString();
  return str.substring(1, str.length - 1).replace(/\\\//g, '/');
}
