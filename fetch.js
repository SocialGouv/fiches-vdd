const fs = require("fs");
const ora = require("ora");

const fetchDataset = require("./fetchDataset");
const toJson = require("./toJson");
const datasets = require("./datasets.json");

// convert XML files in given dataset to an array of JSON structures
const getDatasetJson = async (type, url) => {
  const fiches = [];
  await fetchDataset(type, url, async (entry, downloadSpinner) => {
    let str = "";
    entry
      .on("data", buf => (str += buf.toString()))
      .on("end", () => {
        try {
          const json = toJson(str);
          fiches.push({
            id: entry.path.replace(/\.xml$/, ""),
            ...json
          });
        } catch (err) {
          downloadSpinner.warn(
            `Error while parsing "${entry.path}" of "${type}": ${err}`
          );
        }
      });
  });
  return fiches;
};

const fetchAll = async () => {
  for (const [type, url] of Object.entries(datasets)) {
    fs.mkdirSync(`./data/${type}`, { recursive: true });
    const fiches = await getDatasetJson(type, url);
    const writeSpinner = ora(`Writing "${type}" fiches`).start();
    fiches.forEach(fiche => {
      const fileName = `./data/${type}/${fiche.id}.json`;
      try {
        fs.writeFileSync(fileName, JSON.stringify(fiche, null, 2));
      } catch (err) {
        writeSpinner.warn(`Error saving "${fileName}": ${err.message}`);
      }
    });
    const indexName = `./data/${type}/index.json`;
    const fichesIdArray = fiches.map(fiche => fiche.id);
    try {
      fs.writeFileSync(indexName, JSON.stringify(fichesIdArray, null, 2));
    } catch (err) {
      writeSpinner.fail(`Error saving "${indexName}"  : ${err.message}`);
    }
    writeSpinner.succeed(`Files "${type}" successfully written `);
  }
};

if (require.main === module) {
  fetchAll()
    //.then(console.log)
    .catch(console.log);
}
