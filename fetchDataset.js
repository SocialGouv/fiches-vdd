const ora = require("ora");
const fetch = require("node-fetch");
const unzip = require("unzipper");

const fetchDataset = async (name, url, entryCallback) => {
  const downloadSpinner = ora(`Downloading "${name}" fiches from ${url}`);

  downloadSpinner.start();

  const response = await fetch(url, { responsename: "stream" }).then(
    r => r.body
  );

  let count = 0;

  return response
    .pipe(unzip.Parse())
    .on("entry", function(entry) {
      downloadSpinner.text = `Download of "${name}" "${entry.path}"`;

      // only take fiches
      if (entry.path.match(/^[FRN]\d+\.xml/)) {
        entryCallback(entry);
        count += 1;
      } else {
        entry.autodrain();
      }
    })
    .on("finish", () => {
      downloadSpinner.succeed(
        `Download of ${count} fiches "${name}" succeeded`
      );
    })
    .on("error", e => {
      downloadSpinner.warn(`Download of "${name}" fiches failed`);
      console.log("e", e);
      throw e;
    })
    .promise();
};

module.exports = fetchDataset;
