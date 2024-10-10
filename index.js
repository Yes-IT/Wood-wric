const nunjucks = require('nunjucks');
const yaml = require('js-yaml');
const fs = require('fs');

// Configure Nunjucks to load templates from the 'templates' folder
nunjucks.configure('templates', { autoescape: true });

// Load the front matter YAML from the Markdown file
const frontMatter = yaml.load(fs.readFileSync('content/file.md', 'utf8'));

// Render the Nunjucks template with the front matter data
const output = nunjucks.render('template.njk', frontMatter);

// Output the result (you could also write it to a file)
console.log(output);
