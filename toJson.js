const xmlStringToJsObject = require("xml-js").xml2js;

const toJson = (xml) =>
  xmlStringToJsObject(xml, {
    alwaysArray: true,
    attributesKey: "attributes",
    elementsKey: "children",
    ignoreDeclaration: true,
    ignoreDoctype: true,
    ignoreInstruction: true,
    textKey: "text",
  });

module.exports = toJson;
