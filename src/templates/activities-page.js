import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import { Container, Heading, Icon, Text, Accordion } from "@chakra-ui/react"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import { TriangleDownIcon } from "@chakra-ui/icons"

import SEO from "../components/SEO/seo"
import CustomAccordionItem from "../components/ui/CustomAccordionItem"

import ReactMarkdown from "react-markdown"
import ChakraUIRenderer from "../utils/ChakraUIRenderer"

const Content = ({ option, withTitle = false }) => (
  <>
    {withTitle && (
      <Heading variant="in-box" textTransform="uppercase" mb={4}>
        {option.title}
      </Heading>
    )}
    <ReactMarkdown
      components={ChakraUIRenderer()}
      children={option.description}
    />
  </>
)

const ActivitiesPage = props => {
  const { frontmatter } = props.data.default

  return (
    <>
      <SEO title={frontmatter.title} description={frontmatter.description} />
      <Container py={[4, null, 8]}>
        <Heading mb={4}>{frontmatter.title}</Heading>

        <Accordion display={["inherit", null, "none"]} allowToggle>
          {frontmatter.activities.map((option, index) => (
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
            {frontmatter.activities.map((option, index) => (
              <Tab key={index} justifyContent="space-between" mb={1}>
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
                <Content option={option} withTitle />
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
    default: markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
        description
        activities {
          title
          description
        }
      }
    }
    images: markdownRemark(
      fields: { locale: { eq: "ca" }, templateKey: { eq: "activities-page" } }
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
