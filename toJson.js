const xmlStringToJsObject = require("xml-js").xml2js;

const toJson = xml =>
  xmlStringToJsObject(xml, {
    alwaysArray: true,
    ignoreDeclaration: true,
    ignoreDoctype: true,
    ignoreInstruction: true,
    elementsKey: "children",
    attributesKey: "attributes",
    textKey: "text"
  });

module.exports = toJson;
