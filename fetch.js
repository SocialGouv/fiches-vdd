const fs = require("fs");
const ora = require("ora");

const fetchDataset = require("./fetchDataset");
const toJson = require("./toJson");
const makeIndex = require("./makeIndex");
const datasets = require("./datasets.json");

// convert XML files in given dataset to an array of JSON structures
const getDatasetJson = async (type, url) => {
  const fiches = [];
  await fetchDataset(type, url, async (entry, downloadSpinner) => {
    const chunks = [];
    entry
      .on("data", (buf) => chunks.push(buf))
      .on("end", () => {
        const str = Buffer.concat(chunks).toString("utf8");
        if (/��/.test(str)) {
          console.error(entry.path, "💀 💩 ☠️ ");
          process.exit(1);
        }
        try {
          const json = toJson(str);
          fiches.push({
            id: entry.path.replace(/\.xml$/, ""),
            ...json,
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
    const fichesIdArray = fiches
      .map((fiche) => {
        const fileName = `./data/${type}/${fiche.id}.json`;
        const fileContent = JSON.stringify(fiche, null, 2);
        if (fileContent.length > 100000000) {
          writeSpinner.warn(
            `Error saving "${fileName}": Size is too big ${
              fileContent.length / 1000000
            }MB (git limitation is 100MB). If you need this file, please consider using git-lfs or compression.`
          );
          return undefined;
        } else {
          try {
            fs.writeFileSync(fileName, fileContent);
          } catch (err) {
            writeSpinner.warn(`Error saving "${fileName}": ${err.message}`);
          }
        }
        return fiche.id;
      })
      .filter((ficheId) => ficheId !== undefined);
    const indexName = `./data/${type}/index.json`;
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
    .then(() => {
      const index = makeIndex();
      fs.writeFileSync("./data/index.json", JSON.stringify(index, null, 2));
      console.log(`Summary dumped to data/index.json`);
    })
    .catch(console.log);
}
