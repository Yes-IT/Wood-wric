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
const marked = require("marked");
const { DateTime } = require("luxon");

//config object used to store data for some plugins used below and passed to  metalsmith as metadata for use in templates
const siteConfig = {
  seoSuffix: " | WIRC",
  siteUrl: "https://youwood.com",
  siteName: "WIRC",
};

const templateConfig = {
  engineOptions: {
    autoescape: false,
    trimBlocks: true,
    lstripBlocks: true,
    filters: {
      modifiedTime: function (milliseconds) {
        return new Date(milliseconds).toUTCString();
      },
      cleanUrl: function (val) {
        const regex = /(?<!:)(\/\/)/gm;
        const result = val.replace(regex, "/");
        return result;
      },
      sortEvents: function (arr) {
        var now = DateTime.local();

        //filter out past dates
        arr.filter(function (el) {
          var eventDate = el.date;
          return eventDate > now;
        });
        //sort
        arr.sort(function (a, b) {
          // var aDate = parseInt(a.date.replace(/-/g,''));
          // var bDate = parseInt(b.date.replace(/-/g,''));
          var aDate = a.date;
          var bDate = b.date;

          if (aDate < bDate) {
            return -1;
          }
          if (aDate > bDate) {
            return 1;
          }
          return 0;
        });

        return arr;
      },
      sortCareers: function (arr) {
        arr.sort(function (a, b) {
          if (a.position < b.position) {
            return -1;
          }
          if (a.position > b.position) {
            return 1;
          }
          return 0;
        });

        return arr;
      },
      md: function (content) {
        let out = "";
        if (content) {
          out = marked.parse(content);
        }
        return out;
      },
      /**
       * Find an item in collection by field value
       * @param {*} val
       * @param {string} field to search in collection
       * @param {array} collection - metalsmith collection
       */
      findByField: function (val, field, collection) {
        if (!val || !field || !collection) {
          return "";
        }
        let r = collection.find((item) => item[field] === val);
        return r;
      },
      getRelatedArticlesByIds: function (ids, collection) {
        const articles = collection.filter((item) => {
          return ids.includes(item.id);
        });
        return articles;
      },
      getRelatedArticles: function (collection, collections, path) {
        var relatedArticles = collections["blog"];
        if (collection.length > 1) {
          // var type = collection.filter((c) => c !== 'blog')[0];
          var type = collection.filter(function (c) {
            return c !== "blog";
          });
          if (type[0]) {
            relatedArticles = collections[type[0]];
            relatedArticles = relatedArticles.filter(function (i) {
              return i.path !== path;
            });
          }
        }
        return relatedArticles.slice(0, 3);
      },
      getExcerpt: function (item) {
        var excerpt = item.excerpt;

        if (!excerpt && item.seo) {
          excerpt = item.seo.description;
        }

        return excerpt;
      },
      toJson: function (val) {
        var json = JSON.stringify(val);
        json = json.replace(/\\n/g, "\\\\n");
        json = json.replace(/"/g, '\\"');

        return json;
      },
    },
  },
};

const siteBuild = metalsmith(__dirname)
  .metadata({
    modified: new Date(),
    year: new Date().getFullYear(),
    siteConfig: siteConfig,
    env: process.env.NODE_ENV,
    context: process.env.CONTEXT,
  })
  .source("./src/content")
  .destination("./build/")
  .clean(true)
  .use(
    collections({
      blog: {
        pattern: ["blog/*.md", "!blog/index.md"],
        sortBy: "date",
        reverse: true,
      },
      eventsPage: {
        pattern: "events/index.md",
      },
      quizzes: {
        pattern: "quizzes/*.md",
        refer: false,
      },
      careers: {
        pattern: ["careers/*.md", "!careers/index.md"],
        refer: false,
      },
      events: {
        pattern: ["events/*.md", "!events/index.md"],
        refer: false,
      },
      socialMedia: {
        pattern: "socialMedia/index.md",
        refer: false,
      },
    })
  )
  .use(
    pagination({
      "collections.blog": {
        perPage: 9,
        layout: "blog.njk",
        first: "blog/index.html",
        path: "blog/:num/index.html",
        pageMetadata: {
          title: "Blog",
          seo: { pageTitle: "Blog" },
        },
      },
    })
  )
  .use(
    metadata({
      quizzes: { private: true },
      careers: { private: true },
      events: { private: true },
    })
  )
  .use((files, metalsmith, done) => {
    // Retrieve socialMedia data and add to metadata
    const socialMediaData = metalsmith._metadata.collections.socialMedia;

    if (socialMediaData && socialMediaData.length) {
      metalsmith.metadata().socialMedia = socialMediaData[0]; // Add to global metadata
    } else {
      console.warn("socialMedia.md not found or is empty.");
    }

    done();
  })
  .use(industrialPrivate.plugin())
  .use(markdown())
  .use(permalinks())
  .use(layouts(templateConfig));

if (process.env.NODE_ENV === "dev") {
  siteBuild.use(debugUi.report());
}

siteBuild.use(
  sitemap({
    hostname: siteConfig.siteUrl,
    omitIndex: true,
    xslUrl: "/sitemap.xsl",
    frontmatterIgnore: "exclude_from_sitemap",
  })
);
siteBuild.build(function (err, files) {
  if (err) {
    console.log("!!!!!", err, files);
  }
  //console.log(files)
  console.log("Metalsmith finished!");
});
