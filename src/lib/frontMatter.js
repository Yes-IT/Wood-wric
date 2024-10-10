// src/lib/frontMatter.js
const fs = require('fs');

// Function to read front matter
function readFrontMatter(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/---\n([\s\S]*?)---/);
    
    let frontMatter = {};
    if (match) {
        const frontMatterString = match[1];
        frontMatterString.split('\n').forEach(line => {
            const [key, value] = line.split(': ');
            if (key && value) {
                frontMatter[key.trim()] = value.trim();
            }
        });
    }
    return frontMatter;
}

module.exports = { readFrontMatter };
