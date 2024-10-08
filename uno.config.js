import { defineConfig } from 'unocss';
import { readFrontMatter } from './src/lib/frontMatter.js'; // Import front matter function
import fs from 'fs';
import path from 'path';

// Function to get Markdown files from a directory
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

// Get social media data from the Markdown file
const socialMediaFilePath = './src/content/social-media/social-media.md';
const socialMediaData = readFrontMatter(socialMediaFilePath);

// Export Unocss configuration
export default defineConfig({
    theme: {
        colors: {
            primary: "#008783",
            secondary: "#B48361",
        },
        fontFamily: {
            display: ['Montserrat', 'sans-serif']
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

    // Expose the social media data to your templates (optional, if needed)
    global: {
        socialMedia: socialMediaData,
    }
});
