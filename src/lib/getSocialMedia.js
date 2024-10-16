const fs = require('fs');
const path = require('path');
const fm = require('front-matter');

// Function to fetch social media data from markdown file
function getSocialMedia() {
  const filePath = path.join(__dirname, '../content/social-media/social-media.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { attributes } = fm(fileContent); // Parses the front matter
  return attributes; // Return the key-value pairs directly
}

module.exports = getSocialMedia;

