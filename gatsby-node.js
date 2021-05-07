//const _ = require("lodash")
const path = require("path")
const webpack = require(`webpack`)
const locales = require(`./data/i18n`)
const {
  localizedSlug,
  findKey,
  removeTrailingSlash,
} = require(`./src/utils/gatsby-node-helpers`)
const { createFilePath } = require("gatsby-source-filesystem")

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    plugins: [
      new webpack.IgnorePlugin({
        resourceRegExp: /^netlify-identity-widget$/,
      }),
    ],
  })
}

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return graphql(`
    {
      files: allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            id
            fields {
              slug
              locale
              isDefault
            }
            frontmatter {
              title
              templateKey
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    // Posts and Pages created by markdown
    const contentMarkdown = result.data.files.edges

    // Total of posts (only posts, no pages) per locale
    // It will be increase by the next loop
    let postsTotal = {}
    Object.keys(locales).forEach(item => {
      postsTotal[item] = 0
    })

    contentMarkdown.forEach(edge => {
      const id = edge.node.id
      // Getting Slug and Title
      const slug = edge.node.fields.slug
      const title = edge.node.frontmatter.title

      // Use the fields created in exports.onCreateNode
      const locale = edge.node.fields.locale
      const isDefault = edge.node.fields.isDefault

      const isPage = edge.node.frontmatter.templateKey !== "post-page"

      // Count posts
      postsTotal[locale] = isPage
        ? postsTotal[locale] + 0
        : postsTotal[locale] + 1

      createPage({
        path: localizedSlug({ isDefault, locale, slug, isPage }),
        tags: edge.node.frontmatter.tags,
        component: path.resolve(
          `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
        ),
        // additional data can be passed via context
        matchPath: !isDefault && slug === "404" ? `/${locale}/*` : null,
        context: {
          id,
          locale,
          title,
        },
      })
    })

    // Tag pages
    //let tags = []

    // Iterate through each post, putting all found tags into `tags`
    //contentMarkdown.forEach(edge => {
    //if (_.get(edge, `node.frontmatter.tags`)) {
    //tags = tags.concat(edge.node.frontmatter.tags)
    //}
    //})

    // Eliminate duplicate tags
    //tags = _.uniq(tags)

    // Make tag pages
    //tags.forEach(tag => {
    //const tagPath = `/tags/${_.kebabCase(tag)}/`
    //createPage({
    //path: tagPath,
    //component: path.resolve(`src/templates/tags-page.js`),
    //context: {
    //tag,
    //},
    //})
    //})

    // Creating Posts List and its Pagination
    const postsPerPage = 4
    const postsListTemplate = path.resolve(`./src/templates/posts-list-page.js`)

    Object.keys(locales).map(lang => {
      const numPages = Math.ceil(postsTotal[lang] / postsPerPage)

      // Use the values defined in "locales" to construct the path
      const localizedPath = locales[lang].default
        ? "/blog"
        : `${locales[lang].path}/blog`

      return Array.from({ length: numPages }).forEach((_, index) => {
        createPage({
          path:
            index === 0
              ? `${localizedPath}`
              : `${localizedPath}/page/${index + 1}`,
          component: postsListTemplate,
          context: {
            limit: postsPerPage,
            skip: index * postsPerPage,
            numPages,
            currentPage: index + 1,
            locale: lang,
            dateFormat: locales[lang].dateFormat,
          },
        })
      })
    })
  })
}

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions

  // First delete the incoming page that was automatically created by Gatsby
  // So everything in src/pages/
  deletePage(page)

  // Grab the keys ('en' & 'ca') of locales and map over them
  Object.keys(locales).map(lang => {
    // Use the values defined in "locales" to construct the path
    const localizedPath = locales[lang].default
      ? page.path
      : `${locales[lang].path}${page.path}`

    return createPage({
      // Pass on everything from the original page
      ...page,
      // Since page.path returns with a trailing slash (e.g. "/ca/")
      // We want to remove that (e.g. "ca/")
      path: removeTrailingSlash(localizedPath),
      // Pass in the locale as context to every page
      // This context also gets passed to the src/components/layout file
      // This should ensure that the locale is available on every page
      context: {
        ...page.context,
        locale: lang,
        dateFormat: locales[lang].dateFormat,
      },
    })
  })
}

// Correcting language and slug to the frontmatter of each file
// A new node is created automatically with the filename
// It's necessary to do that to filter by language
// And the slug make sure the urls will be the same for all posts
exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  // Check for "MarkdownRemark" type so that other files (e.g. images) are exluded
  if (node.internal.type === `MarkdownRemark`) {
    // Use path.basename
    // https://nodejs.org/api/path.html#path_path_basename_path_ext
    // It will return the file name without '.md' string (e.g. "file-name" or "file-name.lang")
    const name = path.basename(node.fileAbsolutePath, `.md`)

    // Find the key that has "default: true" set (in this case it returns "en")
    const defaultKey = findKey(locales, o => o.default === true)

    // Check if file.name.lang has the default lang type.
    // (in this case the default language is for files set with "en")
    const isDefault = name.split(`.`)[1] === defaultKey

    // Files are defined with "name-with-dashes.lang.md"
    // So grab the lang from that string
    // If it's the default language, pass the locale for that
    const lang = isDefault ? defaultKey : name.split(`.`)[1]

    // Get the entire file name and remove the lang of it
    const slugFileName = name.split(`.`)[0]
    // Than remove the date if the name has the date info
    const slug = slugFileName.replace(
      /\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])\-/g,
      ""
    )
    // Adding the nodes on GraphQL for each post as "fields"
    createNodeField({ node, name: `slug`, value: slug })
    createNodeField({ node, name: `locale`, value: lang })
    createNodeField({ node, name: `isDefault`, value: isDefault })
  }
}
