const fs = require('fs');
const path = require('path');

module.exports = {
  socialMedia: function () {
    const socialMediaPath = path.join(__dirname, 'content/social-media/social-media.md');
    const data = fs.readFileSync(socialMediaPath, 'utf-8');
    return data.split('\n').reduce((acc, line) => {
      const [key, value] = line.split(':').map(str => str.trim());
      if (key && value) {
        acc[key] = value.replace(/"/g, '');
      }
      return acc;
    }, {});
  }
};
