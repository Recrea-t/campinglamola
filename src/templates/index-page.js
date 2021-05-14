import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"

import SEO from "../components/SEO/seo"
import Card from "../components/ui/Card"
import ServiceSmallCard from "../components/ui/ServiceSmallCard"

import useTranslations from "../components/useTranslations"

import ReactMarkdown from "react-markdown"
import ChakraUIRenderer from "../utils/ChakraUIRenderer"

const IndexPage = props => {
  const { frontmatter } = props.data.markdownRemark
  const servicesFrontmatter = props.data.services.frontmatter

  const { menuTitle, services, environment } = useTranslations()

  const limit = useBreakpointValue({ base: 8, md: 10, lg: 14 })

  return (
    <>
      <SEO title={frontmatter.title} description={frontmatter.description} />
      <Box bg="paleGrey.500">
        <Container py={8}>
          <Heading as="h2" mb={4}>
            {menuTitle}
          </Heading>
          <ReactMarkdown
            components={ChakraUIRenderer()}
            children={frontmatter.summary}
          />
        </Container>
      </Box>
      <Container py={8}>
        <SimpleGrid
          columns={[1, null, 3]}
          spacing={4}
          justifyContent="space-between"
        >
          {frontmatter.camping.map((item, index) => (
            <Card key={index} index={index} {...item} />
          ))}
        </SimpleGrid>
      </Container>
      <Box bg="paleGrey.500">
        <Container py={8}>
          <Heading as="h2" mb={4}>
            {services}
          </Heading>
          <ReactMarkdown
            components={ChakraUIRenderer()}
            children={frontmatter.servicesSummary}
          />
          <SimpleGrid
            my={8}
            columns={[2, null, 5, 7]}
            spacing={8}
            alignItems="baseline"
            justifyContent="space-between"
          >
            {servicesFrontmatter.services
              .slice(0, limit)
              .map((service, index) => (
                <ServiceSmallCard key={index} index={index} {...service} />
              ))}
          </SimpleGrid>
        </Container>
      </Box>
      <Container py={8}>
        <Heading as="h2" mb={4}>
          {environment}
        </Heading>
        <ReactMarkdown
          components={ChakraUIRenderer()}
          children={frontmatter.environmentSummary}
        />
        <SimpleGrid
          columns={[1, null, 3]}
          spacing={4}
          mt={8}
          justifyContent="space-between"
        >
          {frontmatter.environment.map((item, index) => (
            <Card key={index} index={index} {...item} />
          ))}
        </SimpleGrid>
      </Container>
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
  query IndexPageTemplateQuery($id: String, $locale: String) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
        description
        summary
        images {
          childImageSharp {
            gatsbyImageData(
              width: 400
              aspectRatio: 1.33
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
        camping {
          title
          url
          image {
            childImageSharp {
              gatsbyImageData(
                width: 400
                aspectRatio: 1.33
                formats: [AUTO, WEBP, AVIF]
              )
            }
          }
        }
        servicesSummary
        environmentSummary
        environment {
          title
          url
          image {
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
    services: markdownRemark(
      fields: { locale: { eq: $locale }, templateKey: { eq: "services-page" } }
    ) {
      frontmatter {
        services {
          title
          description
          image {
            publicURL
          }
        }
      }
    }
  }
`
