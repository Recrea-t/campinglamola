import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import { Box, Container, Heading, SimpleGrid } from "@chakra-ui/react"

import SEO from "../components/SEO/seo"
import ServiceCard from "../components/ui/ServiceCard"

const ServicesPage = props => {
  const { frontmatter } = props.data.markdownRemark

  return (
    <>
      <SEO title={frontmatter.title} description={frontmatter.description} />
      <Container py={[4, null, 8]}>
        <Heading mb={4}>{frontmatter.title}</Heading>
        {/*<SimpleGrid
          className="grid"
          columns={[1, null, 2, 3]}
          spacing={8}
          autoRows="calc(100px + 2rem)"
				>*/}
        <Box w="full" sx={{ columnCount: [1, null, 2, 3], columnGap: "32px" }}>
          {frontmatter.services.map((service, index) => (
            <ServiceCard key={index} index={index} {...service} />
          ))}
        </Box>
      </Container>
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
            publicURL
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
