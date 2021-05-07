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
              phone {
                number
                title
              }
              address
            }
            social {
              linkedin {
                username
                title
                baseUrl
              }
              facebook {
                username
                title
                baseUrl
              }
              instagram {
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
