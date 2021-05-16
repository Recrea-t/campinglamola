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
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@chakra-ui/react"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons"

import SEO from "../components/SEO/seo"
import { MotionLink } from "../theme/utils"

import useTranslations from "../components/useTranslations"

import ReactMarkdown from "react-markdown"
import ChakraUIRenderer from "../utils/ChakraUIRenderer"

const Content = ({ option }) => {
  const { moreButton } = useTranslations()
  return (
    <>
      <ReactMarkdown
        components={ChakraUIRenderer()}
        children={option.description}
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

const CustomAccordionItem = ({ option }) => (
  <AccordionItem mb={1}>
    {({ isExpanded }) => (
      <>
        <AccordionButton
          _expanded={{
            bg: "paleGrey.500",
            color: "dullBrown.500",
            _hover: {
              bg: "paleGrey.600",
            },
          }}
        >
          <Box as="h3" flex="1" textAlign="left">
            {option.title}
          </Box>
          {isExpanded ? (
            <Icon as={TriangleUpIcon} />
          ) : (
            <Icon as={TriangleDownIcon} />
          )}
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Content option={option} />
        </AccordionPanel>
      </>
    )}
  </AccordionItem>
)

const EnvironmentPage = props => {
  const { frontmatter } = props.data.markdownRemark

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
            <CustomAccordionItem key={index} option={option} />
          ))}
        </Accordion>

        <Tabs
          display={["none", null, "flex"]}
          orientation="vertical"
          variant="enclosed-colored"
          colorScheme="paleGrey"
        >
          <TabList>
            {frontmatter.options.map((option, index) => (
              <Tab key={index} justifyContent="space-between">
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
                <Content option={option} />
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
    markdownRemark(id: { eq: $id }) {
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
