// src/js/lib/socialMedia.js

const fs = require('fs');
const path = require('path');

function getSocialMediaData() {
  const filePath = path.join(__dirname, '../content/social-media/social-media.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Convert markdown frontmatter to JSON (if using markdown)
  const matter = require('gray-matter');
  const socialMediaData = matter(fileContent).data;

  return socialMediaData;
}

module.exports = getSocialMediaData;
