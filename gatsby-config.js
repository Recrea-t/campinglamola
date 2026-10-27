const config = require("./site-config.json")
const areaPages = require("./landing-area/pages.json")

console.log(config)

module.exports = {
  siteMetadata: config,
  plugins: [
    {
      resolve: "@chakra-ui/gatsby-plugin",
      options: {
        isUsingColorMode: false,
      },
    },
    //"gatsby-plugin-preact",
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    `gatsby-transformer-json`,
    "gatsby-plugin-robots-txt",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-preload-fonts",
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        // Páginas que no deben indexarse: 404 por idioma y la shell del modo offline.
        excludes: ["/*/404/", "/*/offline-plugin-app-shell-fallback"],
        // La landing del área de autocaravanas vive en static/ (generada por
        // landing-area/build.py) y Gatsby no la conoce: se añade aquí a mano.
        resolvePages: ({ allSitePage: { nodes } }) => [
          ...nodes,
          ...Object.values(areaPages).map(({ path }) => ({ path })),
        ],
        serialize: ({ path }) => {
          const esArea = Object.values(areaPages).some(p => p.path === path)
          if (!esArea) return { url: path, changefreq: "daily", priority: 0.7 }
          return {
            url: path,
            changefreq: "weekly",
            priority: 0.9,
            links: [
              ...Object.entries(areaPages).map(([lang, p]) => ({
                lang,
                url: p.path,
              })),
              { lang: "x-default", url: areaPages.es.path },
            ],
          }
        },
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: `Càmping La Mola`,
        short_name: `La Mola`,
        description: `Càmping La Mola`,
        lang: `ca`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: "#00ab59",
        display: `minimal-ui`,
        icon: "static/images/icon.svg",
        icon_options: {
          purpose: `any maskable`,
        },
        localize: [
          {
            start_url: `/es/`,
            lang: `es`,
            name: `Camping La Mola`,
            description: `Camping La Mola`,
          },
          {
            start_url: `/en/`,
            lang: `en`,
            name: `La Mola Camping`,
            description: `La Mola Camping`,
          },
          {
            start_url: `/fr/`,
            lang: `fr`,
            name: `Camping La Mola`,
            description: `Camping La Mola`,
          },
          {
            start_url: `/nl/`,
            lang: `nl`,
            name: `Camping La Mola`,
            description: `Camping La Mola`,
          },
        ],
        //cache_busting_mode: "none",
      },
    },
    // The offline plugin must be listed after the manifest plugin
    //"gatsby-plugin-remove-serviceworker",
    "gatsby-plugin-offline",
    //resolve: "gatsby-plugin-offline",
    //options: {
    //workboxConfig: {
    //globPatterns: ["**/icon-path*"],
    //},
    //},
    //},
    {
      // keep as first gatsby-source-filesystem plugin for gatsby image support
      resolve: "gatsby-source-filesystem",
      options: {
        name: "uploads",
        path: `${__dirname}/static/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "translations",
        path: `${__dirname}/data/translations`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "language-mapping",
        path: `${__dirname}/data/language-mapping`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "menu",
        path: `${__dirname}/data/menu`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-relative-images",
            options: {
              name: "uploads",
            },
          },
          {
            resolve: "gatsby-remark-images",
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 1380,
              quality: 90,
              withWebp: true,
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: "gatsby-remark-copy-linked-files",
            options: {
              destinationDir: "static",
            },
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-netlify",
      options: {
        // Las 404 por idioma se sirven con código 404 desde gatsby-node.js
        // (createRedirect); sin esto el plugin añade reglas con código 200.
        generateMatchPathRewrites: false,
        headers: {
          // Landing del área de autocaravanas: imágenes y script con nombre estable o con hash.
          "/area-assets/*": [
            "Cache-Control: public, max-age=2592000, stale-while-revalidate=86400",
          ],
        },
      },
    },
    "gatsby-plugin-netlify-cms",
    //{
    //resolve: "gatsby-plugin-webpack-bundle-analyser-v2",
    //options: {
    //devMode: false,
    //},
    //},
  ],
}
