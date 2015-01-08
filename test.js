/*globals it, describe, before */
var expect = require('expect.js'),
    regexCombiner = require('./regex-combiner');

describe('Regex Combiner', function () {
  var combination = regexCombiner([
    /plain text/,
    /^with* modifiers?/,
    /cha[ra][ra]cter classes/,
    /^with (groups)/,
    /^with (groups|more groups)/,
    /^with (mod+ifiers\s*|in groups{2,3}\s*)+/,
    /sub/,
    /substrings/,
    /char count{1,3}s/,
    /nested (expr[aeiou]ss(ions)?)/,
    /escaped (\)) chars/,
    /escaped ([\)\]]) chars/,
    /escaped ([\)\]]){3} chars/
  ]);

  it('matches combined regexes', function () {
    [
      'plain text',
      'withhh modifier',
      'character classes',
      'with groups',
      'with more groups',
      'with modddifiers in groupss modifiers in groupsss',
      'sub',
      'substrings',
      'char counttts',
      'nested exprassions',
      'nested express',
      'escaped ) chars',
      'escaped ] chars',
      'escaped ]]] chars'
    ].forEach(function (testStr) {
      expect(testStr).to.match(combination);
    });
  });

  it('doesn\'t match other strings', function () {
    [
      'plain',
      'text',
      'something with modifiers',
      'su',
      'char counttttts',
      'escaped ]] chars'
    ].forEach(function (testStr) {
      expect(testStr).not.to.match(combination);
    });
  });

  it('compiles modifiers correctly', function () {
    var combined;
    expect(function () {
      combined = regexCombiner([
        /a/,
        /aa/,
        /a+/,
        /a*/,
        /a?/,
        /a*?/,
        /a+?/,
        /a{1}/,
        /a{3,5}/,
        /a{,5}/,
        /a{3,}/
      ]);
    }).to.not.throwException();
    expect('aa').to.match(combined);
  });

  it('works with strings too', function () {
    var combined = regexCombiner([
      'foo+',
      'food',
      'football',
      /ba[rh]/,
      /bard/
    ]);
    [
      'foo',
      'fooooo',
      'football',
      'food',
      'bar',
      'bah',
      'bard'
    ].forEach(function (testStr) {
      expect(testStr).to.match(combined);
    });
    expect('fo').not.to.match(combined);
    expect('bat').not.to.match(combined);
  });
});
