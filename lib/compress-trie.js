var _   = require('underscore'),
    END = '***';

module.exports = function (trie) {
  compress(trie);
  cleanEndings(trie);
  return trie;
};

function compress(trie) {
  _.each(trie, compressSubtries, trie);
}

function compressSubtries(subtrie, key) {
  compress(subtrie);
  var subkeys = Object.keys(subtrie);
  if (subkeys.length === 1) {
    this[key + subkeys[0]] = subtrie[subkeys[0]];
    delete this[key];
  }
}

function cleanEndings(trie) {
  _.each(trie, function (subtrie, key) {
    if (key.indexOf(END) > -1) {
      trie[key.replace(END, '')] = subtrie;
      delete trie[key];
    }
    cleanEndings(subtrie);
  });
}
