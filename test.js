/*globals it, describe */
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
  describe('API', function () {
    ['test', 'indexOf', 'exec'].forEach(function (fnName) {
      it('provides `' + fnName + '()`', function () {
        expect(combination[fnName]).to.be.a('function');
      });
    });
  });

  describe('.test()', function () {
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
        expect(combination.test(testStr)).to.be(true);
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
        expect(combination.test(testStr)).to.be(false);
      });
    });

    it('compiles modifiers correctly', function () {
      var combined = regexCombiner([
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
      expect(combined.test('aaa')).to.be(true);
    });

    it('works with strings too', function () {
      var combined = regexCombiner([
        'foo+',
        'food',
        'foos',
        'football',
        /ba[rh]/,
        /bard/
      ]);
      [
        'foo',
        'fooooo',
        'football',
        'food',
        'foos',
        'bar',
        'bah',
        'bard'
      ].forEach(function (testStr) {
        expect(combined.test(testStr)).to.be(true);
        expect(combined.indexOf(testStr)).to.be.greaterThan(-1);
        expect(combined.exec(testStr)).to.be.an('array');
      });
      expect(combined.test('fo')).to.be(false);
      expect(combined.test('bat')).to.be(false);
    });

    it('creates character classes correctly', function () {
      var combined = regexCombiner([
        /aa/,
        /a-/,
        /ac/
      ]);
      expect(combined.test('aa')).to.be(true);
      expect(combined.test('ac')).to.be(true);
      expect(combined.test('a-')).to.be(true);
      expect(combined.test('ab')).to.be(false);
    });

    it('combines character classes correctly', function () {
      var combined = regexCombiner([
        /a[a-c]/,
        /a[-_]/,
        /a[efghi]/
      ]);
      expect(combined.test('aa')).to.be(true);
      expect(combined.test('ac')).to.be(true);
      expect(combined.test('a-')).to.be(true);
      expect(combined.test('a_')).to.be(true);
      expect(combined.test('af')).to.be(true);
      expect(combined.test('ad')).to.be(false);
    });
  });

  describe('.indexOf()', function () {
    it('returns the index of the first matching regex', function () {
      expect(combination.indexOf('with groups')).to.be(3);
    });

    it('returns -1 when no match is found', function () {
      expect(combination.indexOf('zxcvbnm')).to.be(-1);
    });
  });

  describe('.exec()', function () {
    it('returns the matching groups of the first matched regex', function () {
      var match = combination.exec('with groups yeah');
      expect(match[0]).to.be('with groups');
      expect(match[1]).to.be('groups');
    });

    it('returns null when no match is found', function () {
      expect(combination.exec('zxcvbnm')).to.be(null);
    });
  });
});
