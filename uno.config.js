import { defineConfig } from 'unocss';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'; // Import gray-matter for parsing frontmatter

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

// Parse the specific social media Markdown file
const socialMediaData = {};
const socialMediaFile = './src/content/social-media/social-media.md'; // Adjust the path as necessary

if (fs.existsSync(socialMediaFile)) {
  const markdownContent = fs.readFileSync(socialMediaFile, 'utf8');
  const parsedData = matter(markdownContent);
  Object.assign(socialMediaData, parsedData.data); // Extract the frontmatter
}

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
