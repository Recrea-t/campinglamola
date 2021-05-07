import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import { Container } from "@chakra-ui/react"

import ReactMarkdown from "react-markdown"
import ChakraUIRenderer from "../utils/ChakraUIRenderer"

import SEO from "../components/SEO/seo"

const PostPage = props => {
  const { frontmatter, rawMarkdownBody } = props.data.markdownRemark

  return (
    <>
      <SEO
        title={frontmatter.title}
        description={frontmatter.description}
        image={frontmatter.image}
        datePublished={frontmatter.date}
        isBlogPost
      />
      <Container className="markdown" variant="with-top-padding">
        <ReactMarkdown
          components={ChakraUIRenderer()}
          children={rawMarkdownBody}
          escapeHtml={false}
        />
      </Container>
    </>
  )
}

PostPage.propTypes = {
  data: PropTypes.shape({
    rawMarkdownBody: PropTypes.object,
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default PostPage

export const query = graphql`
  query PostPageTemplateQuery($id: String) {
    markdownRemark(id: { eq: $id }) {
      id
      rawMarkdownBody
      frontmatter {
        title
        description
        category
        tags
        date
        image {
          childImageSharp {
            gatsbyImageData(
              width: 600
              height: 350
              placeholder: TRACED_SVG
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    }
  }
`
