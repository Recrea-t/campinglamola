import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react"

import SEO from "../components/SEO/seo"
import Card from "../components/ui/Card"
import OfferModal from "../components/ui/OfferModal"
import ServiceSmallCard from "../components/ui/ServiceSmallCard"

import useTranslations from "../components/useTranslations"

import ReactMarkdown from "react-markdown"
import ChakraUIRenderer from "../utils/ChakraUIRenderer"

const IndexPage = props => {
  const { frontmatter } = props.data.default
  const servicesF = props.data.services.frontmatter.services
  const {
    plotsImage,
    gaialsImage,
    bungalowsImage,
    parcNacionalImage,
    parcNaturalImage,
    aneuImage,
  } = props.data.images.frontmatter

  const {
    menuTitle,
    services,
    environment,
    plots,
    gaials,
    bungalows,
    parcNacional,
    parcNatural,
    aneu,
  } = useTranslations()

  const isSmallDevice = useBreakpointValue({ base: true, md: false })
  const limit = useBreakpointValue({ base: 8, md: 10, lg: 14 })

  console.log(frontmatter.offer)

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
          <Card index={0} title={plots} url="/parceles" image={plotsImage} />
          <Card
            index={isSmallDevice ? 0 : 1}
            title={gaials}
            url="/gaials"
            image={gaialsImage}
          />
          <Card
            index={isSmallDevice ? 0 : 2}
            title={bungalows}
            url="/bungalous"
            image={bungalowsImage}
          />
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
            {servicesF.slice(0, limit).map((service, index) => (
              <ServiceSmallCard key={index} index={0} {...service} />
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
          <Card
            index={0}
            title={parcNacional}
            url="/entorn"
            image={parcNaturalImage}
          />
          <Card
            index={isSmallDevice ? 0 : 1}
            title={parcNatural}
            url="/entorn"
            image={parcNacionalImage}
          />
          <Card
            index={isSmallDevice ? 0 : 2}
            title={aneu}
            url="/entorn"
            image={aneuImage}
          />
        </SimpleGrid>
      </Container>

      {frontmatter.offer && frontmatter.offer.active && (
        <OfferModal {...frontmatter.offer} />
      )}
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
    default: markdownRemark(id: { eq: $id }) {
      id
      frontmatter {
        title
        description
        summary
        servicesSummary
        environmentSummary
        offer {
          active
          title
          subtitle
          description
        }
      }
    }
    images: markdownRemark(
      fields: { locale: { eq: "ca" }, templateKey: { eq: "index-page" } }
    ) {
      frontmatter {
        images {
          childImageSharp {
            gatsbyImageData(
              layout: FULL_WIDTH
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
        plotsImage {
          childImageSharp {
            gatsbyImageData(
              width: 400
              aspectRatio: 1.33
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
        gaialsImage {
          childImageSharp {
            gatsbyImageData(
              width: 400
              aspectRatio: 1.33
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
        bungalowsImage {
          childImageSharp {
            gatsbyImageData(
              width: 400
              aspectRatio: 1.33
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
        parcNacionalImage {
          childImageSharp {
            gatsbyImageData(
              width: 400
              aspectRatio: 1.33
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
        parcNaturalImage {
          childImageSharp {
            gatsbyImageData(
              width: 400
              aspectRatio: 1.33
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
        aneuImage {
          childImageSharp {
            gatsbyImageData(
              width: 400
              aspectRatio: 1.33
              formats: [AUTO, WEBP, AVIF]
            )
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
