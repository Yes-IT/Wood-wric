import { defineConfig } from 'unocss';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'; // Import gray-matter for parsing frontmatter

// Function to get social media data from Markdown file
function getSocialMediaData() {
  const filePath = './src/content/social-media/social-media.md'; // Path to your Markdown file
  if (fs.existsSync(filePath)) {
    const markdownContent = fs.readFileSync(filePath, 'utf8');
    const parsedData = matter(markdownContent); // Parse the Markdown content
    return parsedData.data; // Return the frontmatter as an object
  }
  return {}; // Return empty object if file doesn't exist
}

// Get social media data
const socialMediaData = getSocialMediaData();
console.log(socialMediaData); // Log the data to ensure it's fetched correctly

// Function to get all Markdown files from a specified directory
function getMarkdownFiles(dir) {
  const files = fs.readdirSync(dir);
  const markdownFiles = [];

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively get Markdown files from subdirectories
      markdownFiles.push(...getMarkdownFiles(filePath));
    } else if (file.endsWith('.md')) {
      markdownFiles.push(filePath);
    }
  });

  return markdownFiles;
}

// Get all Markdown files from the specified directory
const markdownFiles = getMarkdownFiles('./src/content');

// Export Unocss configuration
export default defineConfig({
  theme: {
    colors: {
      primary: "#008783",
      secondary: "#B48361",
    },
    fontFamily: {
      display: ['Montserrat', 'sans-serif'],
    },
  },
  rules: [
    [/^mw-(\d+)$/, ([, d]) => ({ 'max-width': `${d}px` })],
    [/^mh-(\d+)$/, ([, d]) => ({ 'min-height': `${d}px` })],
    [/^w-(\d+)$/, ([, d]) => ({ 'width': `${d}px` })],
    [/^h-(\d+)$/, ([, d]) => ({ 'height': `${d}px` })],
    [/^text-(\d+)$/, ([, d]) => ({ 'font-size': `${d}px` })],
    [/^grid-auto-(\d+)-(..)$/, ([, d, u]) => ({ 'grid-template-columns': `repeat(auto-fit, minmax(${d}${u}, 1fr))` })],
  ],
  blocklist: [
    'sr-only',
    'hidden',
    'container',
    'blur',
    'uppercase',
    'text-center',
    'block',
    'inline',
    'relative',
    'contents',
    'resize',
    'pb4',
    /^mb[1-4]$/,
  ],

  // Optional: Expose the social media data if needed in Unocss
  socialMediaLinks: socialMediaData, // Expose this if you want to use it in styles or other configurations
});
