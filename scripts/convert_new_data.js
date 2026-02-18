
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../src/data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const processWordGenders = () => {
    const inputPath = 'd:/Food for thought/experiments/mein-deutsch-hub/word-genders.xlsx';
    const outputPath = path.join(dataDir, 'word-genders.json');

    try {
        const workbook = XLSX.readFile(inputPath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        const words = [];
        data.forEach(row => {
            const gender = row['Gender'];
            const rule = row['Rule'];
            const examples = row['Examples'];

            if (examples && typeof examples === 'string') {
                const exampleList = examples.split(',').map(e => e.trim());
                exampleList.forEach(ex => {
                    // Extract article and noun. flexible enough to handle "die Datei" or just "Datei" if gender is missing in example
                    const parts = ex.split(' ');
                    let word = ex;
                    let article = gender; // Default to column gender

                    if (parts.length > 1 && ['der', 'die', 'das'].includes(parts[0].toLowerCase())) {
                        word = parts.slice(1).join(' '); // remove article from word
                        // article = parts[0]; // could use this, but column is safer?
                    }

                    if (word && gender) {
                        words.push({
                            word: word,
                            gender: gender,
                            rule: rule,
                            translation: '' // We don't have translation in this sheet
                        });
                    }
                });
            }
        });

        fs.writeFileSync(outputPath, JSON.stringify(words, null, 2));
        console.log(`Converted Word Genders: ${words.length} items.`);
    } catch (err) {
        console.error('Error processing word genders:', err);
    }
};

const processVerbPrepositions = () => {
    const inputPath = 'd:/Food for thought/experiments/mein-deutsch-hub/verb-prepositions.xlsx';
    const outputPath = path.join(dataDir, 'verb-prepositions.json');

    try {
        const workbook = XLSX.readFile(inputPath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        const verbs = data.map(row => ({
            verb: row['Verb'],
            preposition: row['Preposition'],
            case: row['Case'],
            translation: row['English Meaning'],
            example: row['Example Sentence']
        })).filter(v => v.verb && v.preposition);

        fs.writeFileSync(outputPath, JSON.stringify(verbs, null, 2));
        console.log(`Converted Verb Prepositions: ${verbs.length} items.`);
    } catch (err) {
        console.error('Error processing verb prepositions:', err);
    }
};

processWordGenders();
processVerbPrepositions();
