import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import { Container, Heading } from "@chakra-ui/react"

import SEO from "../components/SEO/seo"

import ReactMarkdown from "react-markdown"
import ChakraUIRenderer from "../utils/ChakraUIRenderer"
import ContactForm from "../components/ui/ContactForm"

const ContactPage = props => {
  const { frontmatter } = props.data.default

  return (
    <>
      <SEO title={frontmatter.title} description={frontmatter.description} />
      <Container py={8}>
        <Heading as="h2" mb={4}>
          {frontmatter.title}
        </Heading>
        <ReactMarkdown
          components={ChakraUIRenderer()}
          children={frontmatter.summary}
          style={{ marginBottom: "1rem" }}
        />

        <ContactForm />
      </Container>
    </>
  )
}

ContactPage.propTypes = {
  data: PropTypes.shape({
    html: PropTypes.object,
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default ContactPage

export const query = graphql`
  query ContactPageTemplateQuery($id: String) {
    default: markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
        description
        summary
      }
    }
  }
`
