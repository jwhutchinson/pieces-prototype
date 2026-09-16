---
permalink: false
---

This is the source code for Pieces.

It is a site that incorporates different directions for future media and engaging with the news. This includes a slower and more reflective engagement and new ways of people sharing their opinions.

I deployed this website with participants in a research project, exploring what under-engaged people would like from future media services. This used https://github.com/robb-j/sator as the backend.

## structure

```
.
├── .github
│   └── workflows
|       └── pages.yml   - A GitHub actions workflow that builds & deploys the site to GitHub pages
│
├── _data               - Contains global data used throughout the website
│   └── site.json       - Meta-information about the site
│
├── _includes           - Templates to use for rendering
│   ├── help.njk        - A layout for the help/about page
│   ├── home.njk        - A layout for the homepage with a hero and content
│   ├── html.njk        - A generic layout for HTML pages
│   ├── logged-in.njk   - A general layout for pages when the user is logged in
│   ├── logged-out.njk  - A general layout for pages when the user is not logged in
│   ├── not-mobile.njk  - A layout for when the user is not using a mobile device
│   ├── opinion.njk     - A layout for the articles in which the user gives their opinion
│   └── topic.njk       - A layout for the completed articles with all pieces published
├── assets              - A folder of static assets that are copied in
├── snippets            - The folder of markdown files for pieces of articles
├── topic               - The folder of markdown files for completed articles
├── node_modules        - Node.js modules, installed with npm
├── .gitignore          - Files to ignore from git source control
├── about.md            - The markdown file for the about page
├── eleventy.config.js  - The Eleventy configuration
├── index.md            - The home page markdown source
├── logged-out.md       - The markdown file for the page when a user is not logged in
├── logged-out.md       - The markdown file for the page when a user is not using a mobile device
├── package-lock.json   - Node.js lock file
├── package.json        - Node.js package info & dependencies
└── README.md           - The file you're reading right now
```
