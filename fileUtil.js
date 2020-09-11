const fs = require('fs');

const checkDirectorySync = (directory="./output") => {
  try {
    fs.statSync(directory);
  } catch(e) {
    fs.mkdirSync(directory);
  }
}

const writeJsonFile = (data, outputFileName) => {
  checkDirectorySync("./output")
  fs.writeFile('./output/' + outputFileName + '.json', JSON.stringify(data, null, 2), (err) => {
    if (err) console.error(`Generate ${outputFileName} JSON file failed: ${err}`)
  });
}

const readJsonFile = (file) => {
  let json = JSON.parse(fs.readFileSync(file, 'utf8'));
  return json;
}

module.exports = {
  writeJsonFile,
  readJsonFile
};
