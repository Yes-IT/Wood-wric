const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function getSocialMedia() {
    const filePath = path.join(__dirname, '../content/social-media/social-media.md');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse the front matter
    const { data } = matter(fileContent);
    
    return data; // This returns the parsed data as an object
}

module.exports = { getSocialMedia };
