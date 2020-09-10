function compareTwoStrings(first, second) {

	first = first.replace(/\s+/g, '');
	second = second.replace(/\s+/g, '');
    if (!first.length && !second.length) return 1;
    if (!first.length || !second.length) return 0;
    if (first === second) return 1;
    if (first.length === 1 && second.length === 1) return 0;
    if (first.length < 2 || second.length < 2) return 0;

    let firstBigrams = new Map();
    let firstTotalCount = 0
	for (let i = 0; i < first.length - 1; i++) {
        for(let j= i + 1 ; j < first.length; j++){
            const bigram = first[i]+first[j]
            firstTotalCount+= 1
            firstBigrams.set(bigram, firstTotalCount);
        }
    };

    let intersectionSize = 0;
    let secondTotalCount = 0
	for (let i = 0; i < second.length - 1; i++) {
        for(let j = i+1; j< second.length; j++){
            const bigram = second[i]+second[j]
            const count  = firstBigrams.has(bigram)
                ? firstBigrams.get(bigram)
                : 0;
            secondTotalCount += 1
            if (count > 0) {
                    firstBigrams.set(bigram, count - count);
                    intersectionSize++;
            }
        }
    }
    let weight = 0;
    let compareTotal = (firstTotalCount + secondTotalCount - 2);
    if(compareTotal >6) {
        weight = 1;
    }else{
        weight = 0.8;
    }

    return ((2.0 * intersectionSize) / ((compareTotal))*weight);
}
function findBestMatch(mainString, stringArray) {

    if (!inputValid(mainString, stringArray)) throw new Error('Bad arguments: First argument should be a string, second should be an array');
    const ratings = [];
    let bestMatchIndex = 0;
    for(let i = 0; i < stringArray.length; i++) {
        const curryString  = stringArray[i];
        const curryRating = compareTwoStrings(mainString, curryString)
        ratings.push({target: curryString , rating: curryRating})
        if (curryRating > ratings[bestMatchIndex].rating) {
            bestMatchIndex = i;
        }
    }

    const bestMatch = ratings[bestMatchIndex];
    return {ratings, bestMatch, bestMatchIndex}
}

function inputValid(mainString, stringArray) {
    if (typeof mainString !== 'string') return false;
    if (!Array.isArray(stringArray)) return false;
    if (!stringArray.length) return false;
    if (stringArray.find(string => typeof string !== 'string')) return false;
    return true
}

module.exports = {
    compareTwoStrings,
    findBestMatch
}
