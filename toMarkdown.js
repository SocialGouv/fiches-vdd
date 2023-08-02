const fiche = require("./data/particuliers/F34746.json");

//F1191

function getText(element = { text: "" }, separator = " ") {
  if (element.type === "text") {
    return element.text.trim();
  }
  if (element.children) {
    return element.children
      .map((child) => getText(child, separator))
      .join(separator);
  }
  if (Array.isArray(element)) {
    return element.map((child) => getText(child, separator)).join(separator);
  }
  return "";
}

const ignoreParagraph = (element) =>
  element.children.map((child) => {
    if (child.name === "Texte") {
      return ignoreParagraph(child);
    }
    if (child.name === "Paragraphe") {
      return child.children;
    }
    return child;
  });

/**
 *
 * @param {import("./fiche").Fiche} fiche
 */
const builder = ({ data, headingLevel = 1, parentAttributes = {} }) => {
  if (!data) return null;

  if (Array.isArray(data)) {
    return data
      .map((child) => builder({ data: child, headingLevel, parentAttributes }))
      .join("");
  }
  if (data.type === "text") {
    return data.text;
  }
  switch (data.name) {
    // Complex elements, we don't immediately parse their children
    case "BlocCas":
      return builder({
        data: data.children,
        headingLevel: headingLevel + 1,
      });
    case "Cas":
      return builder({
        data: data.children,
        headingLevel,
      });
    case "Introduction":
      if (ignoreParagraph(data)) {
        return builder({
          data: ignoreParagraph(data),
        });
      }

    case "Liste":
      return data.children.map((child) =>
        builder({
          data: child.children.map((child) => {
            if (child.name === "Paragraphe")
              return {
                type: "text",
                text: `\n - ${builder({ data: child.children })}`,
              };
            return child;
          }),
          headingLevel,
        })
      );

    case "Tableau":
      const toMarkdownTable = (data) => {
        const cols = data.children.filter((child) => child.name === "Colonne");
        const rows = data.children.filter((child) => child.name === "Rangée");
        return `
${cols.map((col) => (col.name !== "Colonne" ? col.name : " - ")).join(" | ")}
${cols.map((col) => "-------").join(" | ")}
${rows
  .map((row) => row.children.map((cell) => getText(cell)).join(" | "))
  .join("\n")}
        `.trim();
      };
      return "\n\n" + toMarkdownTable(data) + "\n\n";
    // return <Table data={data} headingLevel={headingLevel} />;
    case "Texte":
      return builder({ data: data.children, headingLevel });

    case "Niveau":
    case "Titre":
      return `\n\n${Array.from({ length: headingLevel }, () => "#").join(
        ""
      )} ${getText(data)}\n\n`;

    // "Simple" elements, we can immediately parse their children
    case "ANoter":
    case "ASavoir":
    case "Attention":
    case "Avertissement":
    case "Rappel":
      return builder({
        data: data.children,
        headingLevel: headingLevel + 1,
        parentAttributes: data.attributes,
      });

    case "Chapitre":
    case "SousChapitre":
      return `\n\n${builder({
        data: data.children,
        headingLevel: headingLevel + 1,
        parentAttributes: data.attributes,
      })}`;
    case "Reference":
      return `\n\n\n[${builder({
        data: data.children,
        headingLevel: 0,
      }).trim()}](${data.attributes.URL})`;

    case "MiseEnEvidence":
      return ` **${getText(data)}**`;
    case "Valeur":
      return getText(data);

    case "Exposant":
      return builder({ data: data.children, headingLevel });

    case "Paragraphe":
      return "\n\n" + builder({ data: data.children, headingLevel });

    // These ones are still to be defined
    case "LienIntra":
    case "LienInterne":
      return builder({
        data: data.children,
        headingLevel,
      });
    case "LienExterne":
    case "LienExterneCommente":
      if (data.attributes && data.attributes.URL) {
        return `[${builder({
          data: data.children,
          headingLevel,
        }).trim()}](${encodeURIComponent(data.attributes.URL)})`;
      }
      return builder({
        data: data.children,
        headingLevel,
      });
    case "VoirAussi":
      return builder({
        data: data.children,
        headingLevel,
      });
    case "Fiche":
      return "\n\n Fiche associée: " + getText(data.children[0]);
    case "Dossier":
      return "\n\n Dossier associé: " + getText(data.children[0]);
    case "PourEnSavoirPlus":
      return `\n\n En savoir plus : [${getText(
        data.children[0]
      )}](data.attributes.URL)`;
    case "ServiceEnLigne":
      return `\n\n Service en ligne : [${getText(
        data.children[0]
      )}](data.attributes.URL)`;
    case "Expression":
    case "ListeSituations":
    case "OuSAdresser":
      return null;
    default:
      return null;
  }
};

/**
 *
 * @param {import("./fiche").Fiche} fiche
 */
const toMarkdown = (fiche) => {
  const firstChildChildren = fiche.children[0].children;
  const title = firstChildChildren.find((child) => child.name === "dc:title")
    .children[0].text;
  const description = firstChildChildren.find(
    (child) => child.name === "dc:description"
  ).children[0].text;
  const audience = firstChildChildren.find((child) => child.name === "Audience")
    .children[0].text;
  const subject =
    firstChildChildren.find((child) => child.name === "dc:subject") &&
    firstChildChildren.find((child) => child.name === "dc:subject").children[0]
      .text;
  const markdownEements = [
    `
---
id: ${fiche.id}
url: "${fiche.children[0].attributes.spUrl}"
audience: "${audience}"
subject: "${subject}"
title: "${title}"
description: "${description}"

---
`,
    `# ${title}`,
    builder({ data: firstChildChildren }),
  ];
  return markdownEements.filter(Boolean).join("\n\n").trim();
};

module.exports = toMarkdown;

// console.log("\n---\n");
// //console.log("fiche", fiche);
// console.log(toMarkdown(fiche));
