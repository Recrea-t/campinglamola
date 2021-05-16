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

import ReactMarkdown from "react-markdown"
import ChakraUIRenderer from "../utils/ChakraUIRenderer"

const Content = ({ option }) => (
  <ReactMarkdown
    components={ChakraUIRenderer()}
    children={option.description}
  />
)

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

const ActivitiesPage = props => {
  const { frontmatter } = props.data.markdownRemark

  return (
    <>
      <SEO title={frontmatter.title} description={frontmatter.description} />
      <Container py={[4, null, 8]}>
        <Heading mb={4}>{frontmatter.title}</Heading>

        <Accordion display={["inherit", null, "none"]} allowToggle>
          {frontmatter.activities.map((option, index) => (
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
            {frontmatter.activities.map((option, index) => (
              <Tab key={index} justifyContent="space-between">
                <Text textAlign="left">{option.title}</Text>
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
            {frontmatter.activities.map((option, index) => (
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

ActivitiesPage.propTypes = {
  data: PropTypes.shape({
    html: PropTypes.object,
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default ActivitiesPage

export const query = graphql`
  query ActivitiesPageTemplateQuery($id: String) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
        description
        activities {
          title
          description
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
