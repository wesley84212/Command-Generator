prepareData = (testData) => {
    result = []
    Object.entries(testData).forEach(([key, data]) => {
        result.push(key);
    })
    return result;
}
describe("mac CMD string Similarity test", () => {
    let cmdList = []
    let compareTwoStrings
    let findBestMatch
    const stringSimilarity = require('../index.js');
    const testData = require('./testData/mac.json');
    beforeEach(() => {
        cmdList = prepareData(testData);
        compareTwoStrings = stringSimilarity.compareTwoStrings;
        findBestMatch = stringSimilarity.findBestMatch;
    })
    test('function is not empty', () => {
        expect(typeof compareTwoStrings).toEqual('function');
        expect(typeof findBestMatch).toEqual('function');
    });
    Object.entries(testData).forEach(([key, data]) => {
        data.typo.forEach((string) => {
            if (string.length > 3) {
                test('CMD Similarity test', () => {
                    result = stringSimilarity.findBestMatch(string, cmdList);
                    expect(result.bestMatch.target).toEqual(key)
                })
            }
        })
    })
})
