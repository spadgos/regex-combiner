## Regex Combiner

Combines an array of regexes into a single regex.

### Example

```js
var regexCombiner = require('regex-combiner');
var combined = regexCombiner([
    /abc$/,
    /abcd+e/,
    /a.*/,
    /bar/,
    'bad+' // strings are accepted too
]);
/* /(a(bc($|d+e)|.*)|ba(r|d+))/ */

combined.test('abcdddde'); // true
combined.test('bar'); // true
combined.test('baddd'); // true
```

### Caveats

- No flags! Combining case-sensitive and case-insensitive regexes is ... difficult, so all flags are **ignored**.
- The output regex is pretty much only going to be useful for `.test()`. Trying to get something meaningful from the
  groups is not going to be fun.

### Licence

MIT
