import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import {
  Box,
  Container,
  Heading,
  Icon,
  Text,
  Accordion,
} from "@chakra-ui/react"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import { TriangleDownIcon } from "@chakra-ui/icons"

import SEO from "../components/SEO/seo"
import CustomAccordionItem from "../components/ui/CustomAccordionItem"
import { MotionLink } from "../theme/utils"

import useTranslations from "../components/useTranslations"

import ReactMarkdown from "react-markdown"
import ChakraUIRenderer from "../utils/ChakraUIRenderer"

const Content = ({ option, withTitle }) => {
  const { moreButton } = useTranslations()
  return (
    <>
      {withTitle && (
        <Heading variant="in-box" textTransform="uppercase" mb={1}>
          {option.title}
        </Heading>
      )}
      <ReactMarkdown
        components={ChakraUIRenderer()}
        children={option.description}
        linkTarget="_blank"
      />
      {option.url && (
        <Box w="full" my={4} textAlign="center">
          <MotionLink
            href={option.url}
            title={option.title}
            variant="button"
            colorScheme="dullBrown"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            isExternal
          >
            {moreButton}
          </MotionLink>
        </Box>
      )}
    </>
  )
}

const EnvironmentPage = props => {
  const { frontmatter } = props.data.default

  return (
    <>
      <SEO title={frontmatter.title} description={frontmatter.description} />
      <Container py={[4, null, 8]}>
        <Heading mb={4}>{frontmatter.title}</Heading>
        <ReactMarkdown
          components={ChakraUIRenderer()}
          children={frontmatter.summary}
        />

        <Accordion display={["inherit", null, "none"]} allowToggle>
          {frontmatter.options.map((option, index) => (
            <CustomAccordionItem
              key={index}
              title={option.title}
              content={<Content option={option} />}
            />
          ))}
        </Accordion>

        <Tabs
          display={["none", null, "flex"]}
          orientation="vertical"
          variant="enclosed-colored"
          colorScheme="paleGrey"
        >
          <TabList w="40%">
            {frontmatter.options.map((option, index) => (
              <Tab key={index} justifyContent="space-between" mb={4}>
                <Text>{option.title}</Text>
                <Icon
                  as={TriangleDownIcon}
                  h={5}
                  w={5}
                  transform="rotate(-90deg)"
                />
              </Tab>
            ))}
          </TabList>
          <TabPanels bg="paleGrey.500" ml={8}>
            {frontmatter.options.map((option, index) => (
              <TabPanel key={index}>
                <Content option={option} withTitle />
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Container>
    </>
  )
}

EnvironmentPage.propTypes = {
  data: PropTypes.shape({
    html: PropTypes.object,
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default EnvironmentPage

export const query = graphql`
  query EnvironmentPageTemplateQuery($id: String) {
    default: markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
        description
        summary
        options {
          title
          description
          url
        }
      }
    }
    images: markdownRemark(
      fields: { locale: { eq: "ca" }, templateKey: { eq: "environment-page" } }
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
      }
    }
  }
`
