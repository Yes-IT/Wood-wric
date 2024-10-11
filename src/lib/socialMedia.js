const fs = require('fs');
const matter = require('gray-matter');
const path = require('path');

function getSocialMediaData() {
    const filePath = path.join(__dirname, '../content/social-media/social-media.md');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    return data;
}

module.exports = { getSocialMediaData };
