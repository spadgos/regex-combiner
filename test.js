/*globals it, describe */
var expect = require('expect.js'),
    regexCombiner = require('./regex-combiner');

describe('Regex Combiner', function () {
  var combination = regexCombiner([
    /plain text/,
    /^with* modifiers?/,
    /cha[ra][ra]cter sets/,
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
        'character sets',
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
      expect('aaa').to.match(combined);
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

    it('creates character sets correctly', function () {
      var combined = regexCombiner([
        /aa/,
        /a-/,
        /ac/,
        /a\^/
      ]);
      expect('aa').to.match(combined);
      expect('ac').to.match(combined);
      expect('a-').to.match(combined);
      expect('a^').to.match(combined);
      expect('ab').not.to.match(combined);
    });

    it('combines character sets correctly', function () {
      var combined = regexCombiner([
        /a[a-c]/,
        /a[-_]/,
        /a[efghi]/
      ]);
      expect('aa').to.match(combined);
      expect('ac').to.match(combined);
      expect('a-').to.match(combined);
      expect('a_').to.match(combined);
      expect('af').to.match(combined);
      expect('ad').not.to.match(combined);
    });

    it('handles unicode character sets', function () {
      var combined = regexCombiner([
        /a[\u0050-\u0060]/,
        /a[\u0070-\u0080]/
      ]);
      expect('a\u0050').to.match(combined);
      expect('a\u0060').to.match(combined);
      expect('a\u0070').to.match(combined);
      expect('a\u0080').to.match(combined);
      expect('a\u0065').not.to.match(combined);
    });

    it('combines negated character sets correctly', function () {
      var combined = regexCombiner([
        /a[^b]/,
        /a[^d]/
      ]);
      expect('a').not.to.match(combined);
      expect('ab').to.match(combined);
      expect('ac').to.match(combined);
      expect('ad').to.match(combined);
    });

    it('handles a mix of negated character sets', function () {
      var combined = regexCombiner([
        /a[^-b-d]/,
        /a[de]/
      ]);
      expect('a').not.to.match(combined);
      expect('ab').not.to.match(combined);
      expect('ac').not.to.match(combined);
      expect('ad').to.match(combined);
      expect('ae').to.match(combined);
      expect('a-').not.to.match(combined);
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
