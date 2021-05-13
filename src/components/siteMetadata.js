import { graphql, useStaticQuery } from "gatsby"

const useSiteMetadata = () => {
  const { site } = useStaticQuery(
    graphql`
      query SITE_METADATA_QUERY {
        site {
          siteMetadata {
            defaultTitle: title
            titleTemplate
            defaultDescription: description
            defaultImage: image
            siteUrl
            color
            author {
              name
              description
              url
            }
            organization {
              name
              url
              logo
              email
              phones {
                number
                title
              }
              address
            }
            social {
              facebook {
                username
                title
                baseUrl
              }
            }
          }
        }
      }
    `
  )
  return site.siteMetadata
}

export default useSiteMetadata
