import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import { Box, Container, Heading, SimpleGrid, Text } from "@chakra-ui/react"

import SEO from "../components/SEO/seo"
import Card from "../components/ui/Card"

import useTranslations from "../components/useTranslations"

import ReactMarkdown from "react-markdown"
import ChakraUIRenderer from "../utils/ChakraUIRenderer"

const ServicesPage = props => {
  const { frontmatter } = props.data.markdownRemark
  const { menuTitle, services, environment } = useTranslations()

  return (
    <>
      <SEO title={frontmatter.title} description={frontmatter.description} />
      <Box bg="paleGrey.500">
        <Container py={[4, null, 8]}>
          <Heading mb={4}>{frontmatter.title}</Heading>
          <SimpleGrid></SimpleGrid>
        </Container>
      </Box>
    </>
  )
}

ServicesPage.propTypes = {
  data: PropTypes.shape({
    html: PropTypes.object,
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default ServicesPage

export const query = graphql`
  query ServicesPageTemplateQuery($id: String) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
        description
        services {
          title
          description
          image {
            childImageSharp {
              gatsbyImageData(
                width: 100
                placeholder: TRACED_SVG
                formats: [AUTO, WEBP, AVIF]
              )
            }
          }
        }
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
