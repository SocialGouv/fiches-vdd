const datasets = require("./datasets");

const getFiche = (type, id) => require(`./data/${type}/${id}.json`);

// expose getFiche and all datasets
module.exports = exports = {
  getFiche: getFiche,
  ...Object.keys(datasets).reduce(
    (datasets, type) => ({
      ...datasets,
      [type]: require(`./data/${type}/index.json`)
    }),
    {}
  )
};

if (require.main === module) {
  console.log(exports.associations);

  // récupérer une fiche en particulier
  console.log(exports.getFiche("associations", "F3180"));
}
