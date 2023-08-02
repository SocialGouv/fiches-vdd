const fs = require("fs");
const path = require("path");
const toMarkdown = require("./toMarkdown");

function readDirectoryRecursive(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  return files.flatMap((file) => {
    const filePath = path.join(directoryPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      return readDirectoryRecursive(filePath);
    } else {
      return `${directoryPath}/${file}`;
    }
  });
}

const convertDir = (dir) => {
  const files = readDirectoryRecursive(`./data/${dir}`).filter((file) =>
    file.match(/\/F\d+.json$/)
  );

  files.forEach((file) => {
    const json = JSON.parse(fs.readFileSync(file).toString());
    const md = toMarkdown(json);
    const baseName = file.match(/^.*\/(.*)\.json$/)[1];
    fs.writeFileSync(`./md/${dir}/${baseName}.md`, md);
  });

  console.log(`wrote ${files.length} files to ./md/${dir}`);
};

convertDir("particuliers");
convertDir("associations");
convertDir("professionnels");
