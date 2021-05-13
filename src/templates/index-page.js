import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import { Container } from "@chakra-ui/react"

import SEO from "../components/SEO/seo"

const IndexPage = props => {
  const { frontmatter } = props.data.markdownRemark

  return (
    <>
      <SEO title={frontmatter.title} description={frontmatter.description} />
      <Container mb={8} minH="100vh"></Container>
    </>
  )
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    html: PropTypes.object,
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default IndexPage

export const query = graphql`
  query IndexPageTemplateQuery($id: String) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
        description
        images {
          childImageSharp {
            gatsbyImageData(
              layout: FULL_WIDTH
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    }
  }
`
