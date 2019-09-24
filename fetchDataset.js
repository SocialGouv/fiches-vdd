const ora = require("ora");
const fetch = require("node-fetch");
const unzip = require("unzipper");

const fetchDataset = async (name, url, entryCallback) => {
  const downloadSpinner = ora(
    `Downloading "${name}" fiches from ${url}`
  ).start();

  const dataStream = await fetch(url, { responsename: "stream" }).then(
    r => r.body
  );

  let count = 0;

  return dataStream
    .pipe(unzip.Parse())
    .on("entry", function(entry) {
      if (entry.path.match(/^[FRN]\d+\.xml/)) {
        entryCallback(entry, downloadSpinner);
        count += 1;
      } else {
        entry.autodrain();
      }
    })
    .on("finish", () => {
      downloadSpinner.succeed(`Download of ${count} files "${name}" succeeded`);
    })
    .on("error", e => {
      downloadSpinner.warn(`Download of "${name}" files failed`);
      console.log("e", e);
      throw e;
    })
    .promise();
};

module.exports = fetchDataset;
