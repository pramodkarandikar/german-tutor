
import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = 'd:/Food for thought/experiments/mein-deutsch-hub/German Tutor.xlsx';
const outputPath = path.resolve(__dirname, '../src/data/vocabulary.json');

// Ensure output directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

try {
    const workbook = XLSX.readFile(inputPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);

    // Clean and format data
    const formattedData = data.map((row, index) => ({
        id: index,
        german: row['German'] || '',
        english: row['English'] || '',
        category: row['Category'] || 'Uncategorized',
        usage: row['Comments/Usage'] || ''
    })).filter(item => item.german && item.english); // Filter out empty rows

    fs.writeFileSync(outputPath, JSON.stringify(formattedData, null, 2));
    console.log(`Successfully converted ${formattedData.length} items to ${outputPath}`);

} catch (error) {
    console.error("Error converting data:", error);
    process.exit(1);
}
