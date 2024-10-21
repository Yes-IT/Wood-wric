const metalsmith = require("metalsmith");
const layouts = require("metalsmith-layouts");
const markdown = require("metalsmith-markdown");
const collections = require("metalsmith-collections");
const metadata = require("metalsmith-collection-metadata");
const sitemap = require("metalsmith-mapsite");
const debugUi = require("metalsmith-debug-ui");
const permalinks = require("metalsmith-permalinks");
const pagination = require("metalsmith-pagination");
const industrialPrivate = require("./src/lib/industrial.private.js");
const marked = require('marked');
const { DateTime } = require("luxon");
const nunjucks = require('nunjucks');
require('dotenv').config(); // Load environment variables from .env file

// Set up Nunjucks environment
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src')); // Adjust 'src' to your templates folder
// Add global variables for social media links
env.addGlobal('socialMedia', {
    facebook: process.env.FACEBOOK,
    x: process.env.X,
    linkedin: process.env.LINKEDIN,
    instagram: process.env.INSTAGRAM,
    youtube: process.env.YOUTUBE,
    tiktok: process.env.TIKTOK,
    email: process.env.EMAIL,
});
module.exports = env;

// Configuration object for site metadata
const siteConfig = {
    seoSuffix: " | WIRC",
    siteUrl: "https://youwood.com",
    siteName: "WIRC",
};

// Configuration for Nunjucks template options
const templateConfig = {
    engineOptions: {
        autoescape: false,
        trimBlocks: true,
        lstripBlocks: true,
        filters: {
            modifiedTime: (milliseconds) => new Date(milliseconds).toUTCString(),
            cleanUrl: (val) => val.replace(/(?<!:)(\/\/)/gm, '/'),
            sortEvents: (arr) => {
                const now = DateTime.local();
                return arr
                    .filter(el => el.date > now)
                    .sort((a, b) => a.date - b.date);
            },
            sortCareers: (arr) => arr.sort((a, b) => a.position.localeCompare(b.position)),
            md: (content) => content ? marked.parse(content) : '',
            findByField: (val, field, collection) => {
                if (!val || !field || !collection) return "";
                return collection.find(item => item[field] === val);
            },
            getRelatedArticlesByIds: (ids, collection) => collection.filter(item => ids.includes(item.id)),
            getRelatedArticles: (collection, collections, path) => {
                const relatedArticles = collections['blog'];
                if (collection.length > 1) {
                    const type = collection.filter(c => c !== 'blog')[0];
                    if (type) {
                        return collections[type].filter(i => i.path !== path).slice(0, 3);
                    }
                }
                return relatedArticles.slice(0, 3);
            },
            getExcerpt: (item) => item.excerpt || item.seo?.description || '',
            toJson: (val) => {
                let json = JSON.stringify(val);
                return json.replace(/\\n/g, "\\\\n").replace(/"/g, '\\"');
            }
        }
    }
};

// Set up Metalsmith build
const siteBuild = metalsmith(__dirname)
    .metadata({
        modified: new Date(),
        year: new Date().getFullYear(),
        siteConfig: siteConfig,
        env: process.env.NODE_ENV,
        context: process.env.CONTEXT
    })
    .source("./src/content")
    .destination("./build/")
    .clean(true)
    .use(collections({
        blog: {
            pattern: ["blog/*.md", "!blog/index.md"],
            sortBy: "date",
            reverse: true
        },
        eventsPage: {
            pattern: "events/index.md"
        },
        quizzes: {
            pattern: "quizzes/*.md",
            refer: false
        },
        careers: {
            pattern: ["careers/*.md", "!careers/index.md"],
            refer: false
        },
        events: {
            pattern: ["events/*.md", "!events/index.md"],
            refer: false
        }
    }))
    .use(pagination({
        "collections.blog": {
            perPage: 9,
            layout: "blog.njk",
            first: "blog/index.html",
            path: "blog/:num/index.html",
            pageMetadata: {
                title: "Blog",
                seo: { pageTitle: "Blog" },
            }
        }
    }))
    .use(metadata({
        quizzes: { private: true },
        careers: { private: true },
        events: { private: true },
    }))
    .use(industrialPrivate.plugin())
    .use(markdown())
    .use(permalinks())
    .use(layouts(templateConfig));

// Use debug UI in development mode
if (process.env.NODE_ENV === "dev") {
    siteBuild.use(debugUi.report());
}

// Generate sitemap
siteBuild.use(sitemap({
    hostname: siteConfig.siteUrl,
    omitIndex: true,
    xslUrl: '/sitemap.xsl',
    frontmatterIgnore: 'exclude_from_sitemap'
}));

// Build the site
siteBuild.build((err, files) => {
    if (err) {
        console.error('Error during build:', err);
    } else {
        console.log("Metalsmith finished!");
    }
});
