WIRC/YOUWOOD.COM
========================

https://youwood.com/


This static (JAM stack) site is generated via [metalsmith](http://www.metalsmith.io/) from markdown content files. The `build` directory is what is expected to be deployed for serving to the public
and is regenerated each deploy.


### CMS
There is a [Decap CMS](https://decapcms.org/ instance in place for editing the markdown files (accessible at /admin/).
Access to the CMS is controlled by netlify identity and the git-gateway service.

The CMS admin config file is generated/composed by combining partial files into a larger file. This is done for DRY principles and uses
the npm preprocess module for file manipulation.



Getting Started with Development
----------------

- Clone the repo
- `npm install` to install all dependencies
- `npm start` to begin watching files and preview the site via [browsersync](https://browsersync.io/) at http://localhost:3000 or the url reported in the terminal output if you are already using browsersync. 

[Nodejs](https://nodejs.org/en/) is required to build the site.



Folder Structure
-----------------------
````
project-root
├── build
├── layouts
│   └── partials
├── public
├── src
│   ├── content
│   ├── js
│   └── lib
````

`build` - This folder is .gitignored and generate from running `npm run build`. Don't edit anything in this folder your edits will be destroyed. This is where things are output for hosting on netlify.

`layouts` - This folder contains the main site layout and other page layouts. Layouts us [Nunjucks](https://mozilla.github.io/nunjucks/templating.html) for templating. Partials and other 'included' files related to layout are also here.

`src` - This is where the magic happens. Content is located here in markdown files along with less & js files. The admin portion is also here.

`src/lib` - This folder contains custom plugins for use in metalsmith. It handles updating product urls by appending the cat slug, some nunjucks filters and more.

`public` - This folder is merged into the `build` folder during the build process. It contains things like favicons, pdfs, imgs, etc. - stuff the site needs that is not created during the build.


Building
--------

`npm run build` is the build command. This command compiles js & less,  copies everything from the 'public' folder, creates the admin config file, 
assembles content markdown files into html pages.

Deploying
---------

Deploy to netlify.com via pushing to the git remote origin and publishing via netlify.

Redirects
---------

Redirects can be specified in the `public/_redirects` folder. Check the (Netlify docs)[https://www.netlify.com/docs/redirects/] on this topic.







----------------------
Site launched 3-2-2020