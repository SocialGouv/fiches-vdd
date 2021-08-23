const datasets = require("./datasets.json");

// dump fiches summary for data/index.json

const getFiche = (type, id) => require(`./data/${type}/${id}.json`);

const getFicheMeta = (fiche, name) =>
  fiche &&
  fiche.children &&
  fiche.children.length &&
  fiche.children[0].children.find((c) => c.name === name);

const getFicheMetaText = (fiche, name) => {
  const node = getFicheMeta(fiche, name);
  return (
    (node &&
      node.children &&
      node.children.length &&
      node.children[0] &&
      node.children[0].text) ||
    null
  );
};

const getFicheAriane = (data) => {
  const fil = getFicheMeta(data, "FilDAriane");
  return (
    (fil &&
      fil.children &&
      fil.children.length &&
      fil.children.map((c) => c.children[0].text).join(" > ")) ||
    null
  );
};

const getFicheBreacrumbs = (data) => {
  const fil = getFicheMeta(data, "FilDAriane");
  return (
    (fil &&
      fil.children &&
      fil.children.length &&
      fil.children.map((c) => ({
        id: c.attributes.ID,
        text: c.children[0].text,
      }))) ||
    []
  );
};

const makeIndex = () =>
  Object.keys(datasets).flatMap((key) => {
    const fiches = require(`./data/${key}/index.json`);
    return fiches.map((id) => {
      const data = getFiche(key, id);
      return {
        breadcrumbs: getFicheBreacrumbs(data),
        date: getFicheMetaText(data, "dc:date"),
        id: data.id,
        subject: getFicheMetaText(data, "dc:subject"),
        theme: getFicheAriane(data),
        title: getFicheMetaText(data, "dc:title"),
        type: key,
      };
    });
  });

module.exports = makeIndex;

if (require.main === module) {
  console.log(JSON.stringify(makeIndex(), null, 2));
}
