const fs = require("fs");
const ora = require("ora");
const serialExec = require("promise-serial-exec");

const fetchDataset = require("./fetchDataset");
const toJson = require("./toJson");
const datasets = require("./datasets.json");

// convert XML files in given dataset to an array of JSON structures
const getDatasetJson = async (type, url) => {
  const fiches = [];
  await fetchDataset(type, url, async entry => {
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
        } catch (e) {
          console.log("\nERROR", entry.path);
        }
      });
  });
  return fiches;
};

// fetch all datasets and save locally
const fetchAll = () =>
  serialExec(
    Object.entries(datasets).map(([type, url]) => () =>
      new Promise((resolve, reject) => {
        return getDatasetJson(type, url).then(dataset => {
          dataset.forEach(data => {
            const fileName = `./data/${type}/${data.id}.json`;
            fs.writeFile(fileName, JSON.stringify(data, null, 2), err => {
              if (err) {
                ora(`Error saving "${fileName}"  : ${err.message}`).fail();
              }
            });
          });
          const fileName = `./data/${type}/index.json`;
          const index = dataset.map(datum => datum.id);
          fs.writeFile(fileName, JSON.stringify(index, null, 2), err => {
            if (err) {
              ora(`Error saving "${fileName}"  : ${err.message}`).fail();
              reject();
            } else {
              ora(`Saved in "${fileName}" `).succeed();
              resolve();
            }
          });
        });
      })
    )
  );

if (require.main === module) {
  fetchAll()
    //.then(console.log)
    .catch(console.log);
}
