/**
 * This is used to construct a netlifycms config file from js objects
 */

const yaml = require("js-yaml");
const fs = require("fs");

//base fields that are common to many content types
const baseFields = [
  { name: "title", label: "Title", widget: "string" },
  {
    label: "Permalink",
    name: "permalink",
    widget: "string",
    required: false,
    hint: "Enter a slug to control url access. Example - enter about to access this at the url domain.com/about. If blank, the title will be used.",
  },
  { name: "body", label: "Main Content", widget: "markdown" },
];

const imageField = {
  label: "Main Image",
  name: "image",
  widget: "image",
  required: false,
};
const idField = {
  name: "id",
  label: "id",
  widget: "uuid",
  hint: "read only internal identifier",
};
const seoFields = [
  {
    name: "seo",
    label: "SEO Fields",
    widget: "object",
    collapsed: true,
    fields: [
      {
        label: "Page Title",
        name: "pageTitle",
        widget: "string",
        required: false,
        hint: "Do not include an SEO suffix. One, will be appended automatically",
      },
      {
        label: "Page Description",
        name: "description",
        widget: "string",
        required: false,
        hint: "This shows mostly on search results listings",
      },
      {
        label: "No index, no follow",
        name: "noindex",
        widget: "boolean",
        required: false,
        hint: "This controls visibility to search engines.",
      },
    ],
  },
  {
    name: "og",
    label: "Open Graph Fields",
    widget: "object",
    required: false,
    collapsed: true,
    hint: "OpenGraph social sharing data. See https://ogp.me/ for more info",
    fields: [
      {
        label: "Title",
        name: "title",
        widget: "string",
        required: false,
        hint: "Sharing title.",
      },
      {
        label: "Description",
        name: "description",
        widget: "string",
        required: false,
        hint: "Sharing description.",
      },
      {
        label: "Image",
        name: "image",
        widget: "image",
        required: false,
        hint: "Sharing image - 1200×630 aspect ration ~ 1.91:1 less than 1MB",
      },
    ],
  },
];

// here we start building the netlifycms config object that will be converted to the config.yml file
const config = {
  backend: {
    name: "git-gateway",
    branch: process.env.BRANCH || "main",
  },
  load_config_file: false,
  media_folder: "public/media/uploads",
  public_folder: "/media/uploads",
  show_preview_links: false,
  collections: [
    {
      name: "home",
      label: "Home Page",
      folder: "src/content/",
      create: false,
      delete: false,
      slug: "index",
      filter: {
        // Filter to ensure you only target one file
        field: "layout",
        value: "index.njk",
      },
      fields: [
        {
          label: "Home Page",
          name: "title", // This is important to set the top section title
          widget: "string",
          required: true,
        },
        {
          label: "Hero Section",
          name: "hero",
          widget: "object",
          fields: [
            { label: "Hero Image 1", name: "image1", widget: "image" },
            {
              label: "Hero URL 1",
              name: "url1",
              widget: "string",
              pattern: ["https?://.+", "Must be a valid URL"], // Add a pattern and a description
              format: "url",
            },
            { label: "Hero Image 2", name: "image2", widget: "image" },
            {
              label: "Hero URL 2",
              name: "url2",
              widget: "string",
              pattern: ["https?://.+", "Must be a valid URL"], // Add a pattern and a description
              format: "url",
            },
            {
              label: "Hero Description",
              name: "description",
              widget: "text",
              pattern: [
                "^(.+?\\s+){0,34}(.+)?$", // Allows up to 35 words
                "Must not exceed 35 words.",
              ],
            },
          ],
        },
        {
          label: "Second Section - Cards",
          name: "cards",
          widget: "list",
          fields: [
            { label: "Card Title", name: "title", widget: "string" },
            { label: "Card image", name: "image", widget: "image" },
            {
              label: "Card Description",
              name: "description",
              widget: "text",
              pattern: [
                "^(.+?\\s+){0,19}(.+)?$", // Allows up to 35 words
                "Must not exceed 20 words.",
              ],
            },
            { label: "Card URL", name: "url", widget: "string" },
          ],
          max: 2, // Limits to only 2 cards
        },
        {
          label: "Did You Know Section",
          name: "didYouKnow",
          widget: "list",
          fields: [
            { label: "Title", name: "title", widget: "string" },
            {
              label: "Description",
              name: "description",
              widget: "text",
              pattern: [
                "^(.+?\\s+){0,9}(.+)?$", // Allows up to 35 words
                "Must not exceed 10 words.",
              ],
            },
            { label: "Image", name: "image", widget: "image" },
            { label: "Icon", name: "icon", widget: "image" },
          ],
          max: 3, // Single entry
        },
        {
          label: "About Section",
          name: "about",
          widget: "object",
          fields: [
            { label: "Title", name: "title", widget: "string" },
            {
              label: "Description",
              name: "description",
              widget: "text",
              pattern: [
                "^(.+?\\s+){0,24}(.+)?$", // Allows up to 35 words
                "Must not exceed 24 words.",
              ],
            },
            { label: "Image", name: "image", widget: "image" },
            { label: "URL", name: "url", widget: "string" },
          ],
        },
        {
          label: "Layout",
          name: "layout",
          widget: "hidden",
          default: "index.njk",
        },
      ],
    },
    {
      label: "Why Wood",
      name: "why-wood",
      folder: "src/content/why-wood",
      create: false,
      delete: false,
      editor: { preview: false },
      fields: [
        {
          label: "Banner Title",
          name: "bannerTitle",
          widget: "string",
          required: true,
        },
        {
          label: "Banner Image",
          name: "bannerImage",
          widget: "image",
          required: true,
        },
        { label: "Heading", name: "heading", widget: "string", required: true },
        {
          label: "Description",
          name: "description",
          widget: "text",
          required: true,
        },
        {
          label: "Sliders",
          name: "sliders",
          widget: "object",
          fields: [
            {
              label: "Left Slider",
              name: "left_slider",
              widget: "object",
              fields: [
                {
                  label: "Heading",
                  name: "heading",
                  widget: "string",
                  required: true,
                },
                {
                  label: "Description",
                  name: "description",
                  widget: "text",
                  required: true,
                },
                {
                  label: "Content",
                  name: "content",
                  widget: "markdown",
                  required: true,
                },
              ],
            },
            {
              label: "Right Slider",
              name: "right_slider",
              widget: "object",
              fields: [
                {
                  label: "Heading",
                  name: "heading",
                  widget: "string",
                  required: true,
                },
                {
                  label: "Description",
                  name: "description",
                  widget: "text",
                  required: true,
                },
                {
                  label: "Content",
                  name: "content",
                  widget: "markdown",
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: "Cards",
          name: "cards",
          class: "florring-wpp",
          widget: "list",
          fields: [
            { label: "Image", name: "image", widget: "image", required: true },
            {
              label: "Background Image",
              name: "b_image",
              widget: "image",
              required: true,
            },
            {
              label: "Header",
              name: "header",
              widget: "string",
              required: true,
            },
            {
              label: "Description",
              name: "description",
              widget: "text",
              required: true,
            },
          ],
        },
        {
          label: "Footer Section",
          name: "footer",
          widget: "object",
          fields: [
            { label: "Footer Title", name: "title", widget: "string" },
            { label: "Button Label", name: "btnLabel", widget: "string" },
            { label: "Button URL", name: "url", widget: "string" },
          ],
        },
        {
          label: "Layout",
          name: "layout",
          widget: "hidden",
          default: "whywood.njk",
        },
      ],
    },
    {
      label: "Get Started",
      name: "get-started",
      folder: "src/content/get-started",
      create: false,
      delete: false,
      editor: { preview: false },
      fields: [
        {
          label: "Banner Image",
          name: "bannerImage",
          widget: "image",
          required: true,
        },
        {
          label: "Banner Title",
          name: "bannerTitle",
          widget: "string",
          required: true,
        },
        { label: "Title", name: "title", widget: "string", required: true },
        {
          label: "Description",
          name: "description",
          widget: "text",
          required: true,
        },
        {
          label: "Steps",
          name: "steps",
          widget: "list",
          fields: [
            { label: "Title", name: "title", widget: "string", required: true },
            { label: "Image", name: "image", widget: "image", required: true },
            {
              label: "Content",
              name: "content",
              widget: "markdown", // or use "text" with editor preview false for plain text input
              required: true,
            },
          ],
        },
        {
          label: "Footer Section",
          name: "footer",
          widget: "object",
          fields: [
            { label: "Footer Title", name: "title", widget: "string" },
            { label: "Button Label", name: "btnLabel", widget: "string" },
            { label: "Button URL", name: "url", widget: "string" },
          ],
        },
        {
          label: "Layout",
          name: "layout",
          widget: "hidden",
          default: "getstarted.njk",
        },
      ],
    },
    {
      name: "about",
      label: "About Page",
      folder: "src/content/about",
      create: false,
      delete: false,
      slug: "index",
      fields: [
        {
          label: "Banner Title",
          name: "title",
          widget: "string",
          required: true,
        },
        {
          label: "Banner Image",
          name: "bannerImage",
          widget: "image",
          required: true,
        },
        { label: "Hero Image", name: "hero", widget: "image", required: true },
        {
          label: "Hero Title",
          name: "heroTitle",
          widget: "string",
          required: true,
        },
        {
          label: "Hero Description",
          name: "heroDescription",
          widget: "text",
          required: true,
        },
        {
          label: "SEO Description",
          name: "seo.description",
          widget: "text",
          required: true,
        },
        {
          label: "SEO Page Title",
          name: "seo.pageTitle",
          widget: "string",
          required: true,
        },
        {
          label: "Cards",
          name: "cards",
          widget: "list",
          required: true,
          fields: [
            {
              label: "Card Title",
              name: "title",
              widget: "string",
              required: true,
            },
            {
              label: "Card Copy",
              name: "copy",
              widget: "text",
              required: true,
            },
            {
              label: "Card Image",
              name: "img",
              widget: "image",
              required: true,
            },
          ],
        },
        {
          label: "Executive Associations",
          name: "execAssociations",
          widget: "list",
          required: true,
          fields: [
            { label: "Title", name: "title", widget: "string", required: true },
            { label: "Image", name: "img", widget: "image", required: true },
            { label: "URL", name: "url", widget: "string", required: true },
          ],
        },
        {
          label: "Footer Section",
          name: "footer",
          widget: "object",
          required: true,
          fields: [
            {
              label: "Footer Title",
              name: "title",
              widget: "string",
              required: true,
            },
            {
              label: "Button Label",
              name: "btnLabel",
              widget: "string",
              required: true,
            },
            {
              label: "Button URL",
              name: "url",
              widget: "string",
              required: true,
            },
          ],
        },
        {
          label: "Layout",
          name: "layout",
          widget: "hidden",
          default: "about.njk",
          required: true,
        },
      ],
    },
    {
      label: "Videos",
      name: "videos",
      folder: "src/content/videos",
      create: false,
      delete: false,
      editor: { preview: false },
      fields: [
        {
          label: "Banner Image",
          name: "heroImage",
          widget: "image",
          required: true,
        },
        {
          label: "Banner Title",
          name: "bannerTitle",
          widget: "string",
          required: true,
        },
        { label: "Title", name: "title", widget: "string", required: true },
        {
          label: "Description",
          name: "description",
          widget: "text",
          required: true,
        },
        {
          label: "Video Sections",
          name: "sections",
          widget: "list",
          fields: [
            { label: "Image", name: "image", widget: "image", required: true },
            { label: "Link", name: "link", widget: "string", required: true },
            { label: "Title", name: "title", widget: "string", required: true },
            {
              label: "Description",
              name: "description",
              widget: "text",
              required: true,
            },
          ],
        },
        {
          label: "Footer Section",
          name: "footer",
          widget: "object",
          fields: [
            { label: "Footer Title", name: "title", widget: "string" },
            { label: "Button Label", name: "btnLabel", widget: "string" },
            { label: "Button URL", name: "url", widget: "string" },
          ],
        },
        {
          label: "Layout",
          name: "layout",
          widget: "hidden",
          default: "videos.njk",
        },
      ],
    },
    {
      label: "Blog",
      label_singular: "Post",
      name: "blog",
      folder: "src/content/blog",
      create: true,
      editor: { preview: false },
      sortable_fields: ["commit_date", "title", "date"],
      filter: { field: "layout", value: "article.njk" },
      summary: "{{title}} ({{date}})",
      fields: [
        {
          name: "layout",
          label: "layout",
          widget: "hidden",
          value: "article.njk",
        },
        {
          name: "date",
          label: "Publish Date",
          widget: "datetime",
          format: "YYYY-MM-DD",
          required: true,
        },
        imageField,
        {
          name: "heroPosition",
          label: "Hero Image Position",
          widget: "select",
          required: true,
          options: [
            { label: "Top", value: "top" },
            { label: "Bottom", value: "bottom" },
          ],
        },
        {
          label: "Audience",
          name: "collection",
          widget: "select",
          required: true,
          options: [
            { label: "Teenage Audience", value: "teenage-audience" },
            {
              label: "Career Switcher Audience",
              value: "career-switcher-audience",
            },
          ],
        },
        {
          name: "relatedArticles",
          label: "Related Articles",
          widget: "relation",
          collection: "blog",
          search_fields: ["title"],
          value_field: "id",
          display_fields: ["title"],
          required: false,
          multiple: true,
          hint: 'Choose specific articles here to override the built in "Related Articles"',
        },
        {
          label: "Thumbnail",
          name: "thumbnail",
          widget: "image",
          hint: "~380px X ~271px",
          required: false,
        },
        {
          name: "quizId",
          label: "Quiz",
          widget: "relation",
          collection: "quizzes",
          search_fields: ["title"],
          value_field: "id",
          display_fields: ["title"],
          required: false,
        },
        {
          name: "postCta",
          label: "Post CTA",
          widget: "object",
          fields: [
            {
              label: "Headline",
              name: "headline",
              widget: "string",
              required: false,
            },
            { label: "URL", name: "url", widget: "string", required: false },
          ],
        },
        {
          name: "shortTitle",
          label: "Short Title",
          widget: "string",
          required: false,
          hint: "Shows in place of title on preview cards.",
        },
        {
          label: "Excerpt",
          name: "excerpt",
          widget: "text",
          required: false,
          hint: "SEO description will be used if not provided.",
        },
        ...baseFields,
        ...seoFields,
        {
          name: "private",
          label: "Private",
          widget: "boolean",
          required: false,
        },
        idField,
      ],
    },
    {
      label: "Events",
      name: "events",
      folder: "src/content/events",
      create: true,
      label_singular: "Event",
      editor: { preview: false },
      sortable_fields: ["commit_date", "title", "date"],
      summary: "{{date}} - {{title}}",
      fields: [
        {
          name: "date",
          label: "Drop Off Date",
          widget: "datetime",
          format: "YYYY-MM-DD",
          required: true,
          hint: "The date the event will disappear from the site (is not visible)",
        },
        {
          name: "title",
          label: "Event Name",
          widget: "string",
          required: true,
        },
        {
          name: "dateDisplay",
          label: "Date Display",
          widget: "string",
          required: true,
          hint: "This shows with the event.",
        },
        { name: "description", label: "Description", widget: "text" },
        { name: "info", label: "Info Url", widget: "string", required: true },
        {
          name: "rsvp",
          label: "Register Url",
          widget: "string",
          required: true,
        },
        {
          name: "img",
          label: "Image",
          widget: "image",
          default: "/imgs/event-default.jpg",
          required: false,
        },
        {
          name: "location",
          label: "Location",
          widget: "string",
          required: false,
        },
        { name: "private", label: "Private", widget: "hidden", value: "true" },
      ],
    },
    
    {
      label: "Careers",
      name: "careers",
      folder: "src/content/careers",
      create: true,
      editor: { preview: false },
      // filter: {field: "permalink", value: "false"},
      fields: [
        { label: "Title", name: "title", widget: "string", required: true },
        {
          label: "Position",
          name: "position",
          widget: "number",
          value_type: "int",
          required: true,
          default: 0,
        },
        {
          name: "img",
          label: "Image",
          widget: "image",
          default: "/imgs/event-default.jpg",
          required: false,
        },
        {
          name: "largeImg",
          label: "Large Image",
          widget: "image",
          default: "/imgs/event-default.jpg",
          required: false,
        },
        { name: "what", label: "What", widget: "text", required: true },
        {
          name: "requirements",
          label: "Requirements",
          widget: "text",
          required: true,
        },
        { name: "skills", label: "Skills", widget: "text", required: true },
        {
          name: "certificates",
          label: "Certificates",
          widget: "text",
          required: true,
        },
        {
          name: "education",
          label: "Education",
          widget: "text",
          required: true,
        },
        { name: "salary", label: "Salary", widget: "string", required: true },
        idField,
      ],
    },
    {
      label: "Quizzes",
      label_singular: "Quiz",
      name: "quizzes",
      folder: "src/content/quizzes",
      create: true,
      editor: { preview: false },
      fields: [
        { label: "Title", name: "title", widget: "string", required: true },
        idField,
        {
          label: "Questions",
          name: "questions",
          widget: "list",
          fields: [
            {
              label: "Headline",
              name: "headline",
              widget: "string",
              required: true,
              default: "Think You Know Wood?",
            },
            {
              label: "Quiz Question",
              name: "question",
              widget: "string",
              required: true,
            },
            {
              label: "Answers",
              name: "answers",
              widget: "list",
              fields: [
                {
                  label: "Label",
                  name: "label",
                  widget: "string",
                  required: true,
                },
                {
                  label: "Explanation",
                  name: "explanation",
                  widget: "text",
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: "Landing Pages",
      label_singular: "Landing Page",
      name: "langindPages",
      folder: "src/content/landing-pages",
      create: true,
      editor: { preview: false },
      sortable_fields: ["commit_date", "title", "date"],
      fields: [
        { name: "title", label: "Title", widget: "string" },
        {
          label: "Permalink",
          name: "permalink",
          widget: "string",
          required: false,
          hint: "Enter a slug to control url access. Example - enter about to access this at the url domain.com/about. If blank, the title will be used.",
        },
        ...seoFields,
        {
          label: "Hero SVG",
          name: "jumboSvg",
          widget: "string",
          required: true,
        },
        {
          label: "Hero SVG Alt Text",
          name: "jumboSvgAltText",
          widget: "string",
          required: true,
        },
        {
          label: "Video",
          name: "video",
          widget: "object",
          fields: [
            {
              label: "Embed",
              name: "embed",
              widget: "string",
              required: false,
            },
            {
              label: "Poster Image",
              name: "poster",
              widget: "image",
              required: false,
            },
            {
              label: "Caption",
              name: "caption",
              widget: "text",
              required: false,
            },
          ],
        },
        {
          label: "Callout Section",
          name: "calloutSection",
          widget: "object",
          fields: [
            {
              label: "Headline",
              name: "headline",
              widget: "string",
              required: false,
            },
            { label: "Image", name: "img", widget: "image", required: false },
            {
              label: "Copy Items",
              name: "copyItems",
              widget: "list",
              required: false,
              fields: [
                {
                  label: "Copy",
                  name: "copy",
                  widget: "markdown",
                  required: false,
                },
              ],
            },
            {
              label: "CTA",
              name: "cta",
              widget: "object",
              collapsed: true,
              fields: [
                {
                  label: "Label",
                  name: "label",
                  widget: "string",
                  required: false,
                },
                {
                  label: "Url",
                  name: "url",
                  widget: "string",
                  required: false,
                },
              ],
            },
          ],
        },
        {
          label: "Quotes",
          name: "quotes",
          widget: "list",
          fields: [
            { label: "Copy", name: "copy", widget: "text", required: false },
            { label: "Image", name: "img", widget: "image", required: false },
            {
              label: "Attestant (who said it)",
              name: "attestant",
              widget: "string",
              required: false,
            },
            {
              label: "Attestant Details",
              name: "attestantDetails",
              widget: "string",
              required: false,
            },
            {
              label: "Image Layout",
              name: "imageLayout",
              widget: "select",
              options: ["left", "right"],
              default: ["right"],
            },
          ],
        },
        {
          label: "Carousel",
          name: "carousel",
          widget: "list",
          fields: [
            {
              label: "Headline",
              name: "headline",
              widget: "string",
              required: false,
            },
            { label: "Copy", name: "copy", widget: "text", required: false },
            { label: "Image", name: "img", widget: "image", required: false },
            {
              name: "button",
              required: false,
              widget: "object",
              collapsed: true,
              fields: [
                {
                  label: "Label",
                  name: "label",
                  widget: "string",
                  required: false,
                },
                {
                  label: "Url",
                  name: "url",
                  widget: "string",
                  required: false,
                },
              ],
            },
          ],
        },
        {
          name: "ctaBlocks",
          label: "CTA Blocks",
          required: false,
          widget: "list",
          fields: [
            {
              label: "Headline",
              name: "headline",
              widget: "string",
              required: false,
            },
            {
              label: "Suhead",
              name: "subhead",
              widget: "string",
              required: false,
            },
            {
              label: "Label",
              name: "linkLabel",
              widget: "string",
              required: false,
            },
            { label: "Url", name: "url", widget: "string", required: false },
            { label: "Image", name: "image", widget: "image", required: false },
          ],
        },
        {
          label: "Events Headline",
          name: "eventsHeadline",
          widget: "string",
          required: false,
        },
        {
          label: "Events Intro",
          name: "eventsIntro",
          widget: "text",
          required: false,
        },
        {
          name: "form",
          label: "Active Campaign Form Embed",
          widget: "text",
          required: false,
        },
        {
          name: "additionalHeadScripts",
          label: "Additional Head Scripts",
          hint: "eg. tracking snippets to go in the document head",
          widget: "text",
          required: false,
        },
        {
          name: "quizId",
          label: "Quiz",
          widget: "relation",
          collection: "quizzes",
          search_fields: ["title"],
          value_field: "id",
          display_fields: ["title"],
        },
      ],
    },
    {
      label: "Pages",
      name: "pages",
      editor: {
        preview: false,
      },
      files: [
        {
          label: "Privacy Policy",
          name: "privacy-policy",
          file: "src/content/privacy-policy.md",
          fields: [...baseFields, ...seoFields],
        },
        {
          label: "Events",
          name: "events",
          file: "src/content/events/index.md",
          fields: [baseFields[0], baseFields[1], ...seoFields],
        },
      ],
    },
   
  
    

   
   

    {
      name: "socialMedia", // Name of the collection
      label: "Social Media Links", // Label for the admin panel
      folder: "src/content/socialMedia", // Folder where the social media links will be stored
      create: false,
      delete: false,
      slug: "index", // Slug for the file
      fields: [
        { label: "Facebook URL", name: "facebook", widget: "string" },
        { label: "X URL", name: "x", widget: "string" },
        { label: "LinkedIn URL", name: "linkedin", widget: "string" },
        { label: "Instagram URL", name: "instagram", widget: "string" },
        { label: "YouTube URL", name: "youtube", widget: "string" },
        { label: "TikTok URL", name: "tiktok", widget: "string" },
        {
          label: "Email Address",
          name: "email",
          widget: "string",
          required: false,
        },
      ],
    },
  ],
};
const data = yaml.dump(config, { noRefs: true, flowLevel: -1 });
console.log(data);
