const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const files = [
  'd:/Food for thought/experiments/input-data/da-usage.xlsx',
  'd:/Food for thought/experiments/input-data/expressions.xlsx',
  'd:/Food for thought/experiments/input-data/articles-and-more.xlsx',
  'd:/Food for thought/experiments/input-data/local-prepositions.xlsx'
];

const outDir = 'd:/Food for thought/experiments/german-tutor-app/src/data';

files.forEach(file => {
  if (fs.existsSync(file)) {
    const workbook = xlsx.readFile(file);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const basename = path.basename(file, '.xlsx');
    fs.writeFileSync(path.join(outDir, `${basename}.json`), JSON.stringify(data, null, 2));
    console.log(`Converted ${basename}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
