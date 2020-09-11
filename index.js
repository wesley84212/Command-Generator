const request = require("request");
const cheerio = require("cheerio");
const file = require('./fileUtil');

const getMain = () => {
  request({
    url: "https://ss64.com/osx/",
    method: "GET"
  }, (error, response, body) => {
    if (error || !body) {
      return;
    }
    const $ = cheerio.load(body);
    const list = $(".space > a");
    let obj = {};

    list.each((i, el) => {
      if (list[i+1] && list[i+1].prev) {
        let key = $(el).text();
        let desc = list[i+1].prev.data.trim();
        obj[key] = {
          "description": desc,
          "options": {},
          "typo": chunkPermute(key)
        };
        // for special case
        if (desc.includes("\n")) {
          let splitDesc = desc.split("\n");
          obj[key] = {
            "description": splitDesc[0].trim(),
            "options": {},
            "typo": chunkPermute(key)
          };
          splitDesc.forEach((val) => {
            // skip [a,b,c,d....] index
            if (val.length !== 1 && val.includes("  ")) {
              let str = val.trim();
              for (let j = 0; j < str.length; j++) {
                let specialCaseObj = {};
                if (str.charAt(j) === " " && /[A-Z]/.test(str.charAt(j+1)) && str.slice(0, j).trim().length < 15) {
                  specialCaseObj[str.slice(0, j).trim()] = {
                    "description": str.slice(j).trim(),
                    "options": {},
                    "typo": chunkPermute(str.slice(0, j).trim())
                  }
                }
                if (Object.keys(specialCaseObj).length !== 0) {
                  Object.assign(obj, specialCaseObj)
                }
              }
            }
          })
        }
      }
    })
    // remove AppleScript
    delete obj["AppleScript"];
    // group command list by alphabet
    // const groupByFirstAlpha = Object.keys(obj).reduce((result, word) => {
    //   // get the first letter. (this assumes no empty words in the list)
    //   const letter = word[0].toLowerCase();
    //   // ensure the result has an entry for this letter
    //   result[letter] = result[letter] || [];
    //   // add the word to the letter index
    //   result[letter].push(word);
    //   // return the updated result
    //   return result;
    // }, {})

    file.writeJsonFile(obj, "mac");
    console.log("Done")
  });
};

String.prototype.insertInto = function (position, s) {
  return this.slice(0, position) + s + this.slice(position);
};

const permute = (str) => {
  // console.log('permuting...', str);
  let permutations = [];
  if (typeof str !== "string") {
    return null;
  }

  // simpliest case "" -> []
  if (str.length === 0) {
    permutations.push("");
    return permutations;
  }
  // simple case "a" -> ['a']
  else if (str.length === 1) {
    permutations.push(str);
    return permutations;
  }
  // recursive case "abc" -> "a" inserted in all permutations of "b" and "c"
  else {
    let head = str.charAt(0);
    let tail = str.substring(1, str.length);

    // array with results
    let permutatedTail = permute(tail);

    // insert head into every posible combination of combinationList
    permutatedTail.forEach((chunk) => {
      for (let i = 0; i <= chunk.length; i++) {
        let insertd = chunk.insertInto(i, head);
        permutations.push(insertd);
      }
    });

    return permutations;
  }
}

const permute2 = (str) => {
  if (str.length > 6) {
    let tmpStr = str.slice(2, str.length-2)
    console.log(tmpStr)
  }
  console.log('permuting...', str);
  if (str.length < 2) return str;

  let permutations = [];
  for (let i = 0; i < str.length; i++) {
    let char = str[i];

    // skip duplicate
    if (str.indexOf(char) !== i) {
      continue;
    }

    let remainingString = str.slice(0, i) + str.slice(i + 1, str.length);

    for (let subPermutation of permute2(remainingString)) {
      permutations.push(char + subPermutation);
    }
  }

  return permutations;
}

const chunkPermute = (str) => {
  let result = [];
  let typeNumber = process.argv[2] || 10;
  let chunkSize = str.match(/.{1,6}/g).length;
  if (chunkSize > 1) {
    let first = str.slice(0, (chunkSize-1)*2);
    let last = str.slice(-((chunkSize-1)*2));
    let middle = str.slice(first.length, str.length-last.length);
    let middleRes = permute(middle).slice(0, typeNumber)
    result = middleRes.map((el) => {
      return first + el + last;
    })
  } else {
    result = permute(str).slice(0, typeNumber)
  }
  
  return result
}

getMain();
