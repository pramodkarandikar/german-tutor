const XLSX = require('xlsx');
const fs = require('fs');

function convertToJson(filePath, outPath) {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
        console.log(`\nSuccessfully converted ${filePath} to ${outPath}`);
        console.log("First 2 items:", data.slice(0, 2));
    } catch (e) {
        console.error(`Error converting ${filePath}:`, e.message);
    }
}

convertToJson('d:/Food for thought/experiments/input-data/100-verbs-pp.xlsx', './src/data/verbs_pp.json');
convertToJson('d:/Food for thought/experiments/input-data/adjectives.xlsx', './src/data/adjectives.json');
convertToJson('d:/Food for thought/experiments/input-data/opposites.xlsx', './src/data/opposites.json');
