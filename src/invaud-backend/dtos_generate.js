const fs = require('fs');
const path = require('path');
const readline = require('readline');

let dtoFilePaths = [];
let fileSuffixes = [];

const fileSuffixString = process.argv[2];

if (!fileSuffixString) {
  fileSuffixes = ['.dto.ts'];
} else {
  fileSuffixes = fileSuffixString.trim().split(',');
}

traverseDir(`${__dirname}/src`);

console.log(`Found ${dtoFilePaths.length} dto files to convert...`);

let dtoData = `// DO NOT EDIT THIS FILE.\n// This file is generated from all dto.ts files (${dtoFilePaths.length} files) in backend/src/*. \n\n`;

writeToCoreFile();

async function writeToCoreFile() {
  await generateDtoData();
  fs.writeFileSync(
    `${__dirname}/../core/generated/core.dtos.ts`,
    dtoData,
    (err) => {
      if (err) throw err;
    },
  );
}

async function generateDtoData() {
  for (let i = 0; i < dtoFilePaths.length; i++) {
    await processLineByLine(dtoFilePaths[i]);
  }
}

async function processLineByLine(filePath) {
  if (!filePath) return;

  const fileStream = fs.createReadStream(filePath);

  const lineReader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (let line of lineReader) {
    // Skip decorators
    if (line.trim().match(/^@/)) {
      continue;
    }

    // Skip imports
    if (line.trim().match(/^import/)) {
      continue;
    }

    // Change class into interface
    line = line.replace('export class', 'export interface');

    dtoData += line + '\n';
  }
}

function traverseDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    let fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else {
      if (fileSuffixMatch(file)) {
        dtoFilePaths.push(fullPath);
      }
    }
  });
}

function fileSuffixMatch(fileName) {
  for (let i = 0; i < fileSuffixes.length; i++) {
    if (fileName.split(fileSuffixes[i]).length > 1) {
      return true;
    }
  }
  return false;
}
