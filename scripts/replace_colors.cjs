const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.jsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replacements
  content = content.replace(/from-indigo-600 via-purple-600 to-pink-500/g, 'from-primary via-primary/80 to-accent');
  content = content.replace(/dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400/g, 'dark:from-primary dark:via-primary/80 dark:to-accent');
  
  content = content.replace(/bg-indigo-500\/10/g, 'bg-primary/10');
  content = content.replace(/bg-indigo-500\/5/g, 'bg-primary/5');
  content = content.replace(/dark:bg-indigo-400\/5/g, 'dark:bg-primary/5');
  content = content.replace(/border-indigo-500\/10/g, 'border-primary/10');
  
  content = content.replace(/text-indigo-600 dark:text-indigo-400/g, 'text-primary');
  content = content.replace(/text-indigo-600/g, 'text-primary'); // any leftovers
  
  content = content.replace(/from-indigo-500 to-purple-500/g, 'from-primary to-accent');
  
  content = content.replace(/from-indigo-50\/20 via-surface to-purple-50\/20/g, 'from-primary/10 via-surface to-accent/10');
  content = content.replace(/dark:from-indigo-950\/30 dark:via-surface dark:to-purple-950\/30/g, 'dark:from-primary/10 dark:via-surface dark:to-accent/10');
  
  content = content.replace(/bg-purple-600/g, 'bg-primary');
  content = content.replace(/bg-purple-100 dark:bg-purple-900\/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900\/50 hover:border-purple-300/g, 
                            'bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary/30');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

walkDir(srcDir, processFile);
console.log('Color replacements complete.');
