const stringSimilarity = require('../index.js');
const compareTwoStrings = stringSimilarity.compareTwoStrings;
const findBestMatch = stringSimilarity.findBestMatch;

test('function is not empty', () => {
    expect(typeof compareTwoStrings).toEqual('function');
    expect(typeof findBestMatch).toEqual('function');
})

test('test compareTwoStrings ', () => {
    expect(stringSimilarity.compareTwoStrings('grep','grrp')).toBe(0.75);
  });

test('test compareTwoStrings ', () => {
    expect(stringSimilarity.compareTwoStrings('grep','grrp')).toBe(0.75);
});