// src/js/lib/nunjucksConfig.js
const nunjucks = require('nunjucks');
const getSocialMediaData = require('./socialMedia');

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src'));

// Register the social media data globally
env.addGlobal('socialMedia', getSocialMediaData());

module.exports = env;
