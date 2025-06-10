import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import {
  Container,
  Heading,
  Icon,
  Text,
  Accordion,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
} from "@chakra-ui/react"
import { TriangleDownIcon } from "@chakra-ui/icons"

import SEO from "../components/SEO/seo"
import CustomAccordionItem from "../components/ui/CustomAccordionItem"
import SeasonsPricingItem from "../components/ui/SeasonsPricingItem"

import { MotionLink } from "../theme/utils"

import useTranslations from "../components/useTranslations"

import ReactMarkdown from "react-markdown"
import ChakraUIRenderer from "../utils/ChakraUIRenderer"

const Content = ({ title, content }) => (
  <>
    {title && (
      <Heading variant="in-box" mb={4} textTransform="uppercase">
        {title}
      </Heading>
    )}
    <ReactMarkdown
      components={ChakraUIRenderer()}
      children={content}
      linkTarget="_blank"
    />
  </>
)

const BungalowsPage = props => {
  const { frontmatter } = props.data.default
  const { summary, regulation, conditions, reservations } =
    useTranslations()

  return (
    <>
      <SEO title={frontmatter.title} description={frontmatter.description} />
      <Container py={[4, null, 8]}>
        <Heading mb={4}>{frontmatter.title}</Heading>

        <Accordion display={["inherit", null, "none"]} allowToggle>
          <CustomAccordionItem
            title={summary}
            content={<Content content={frontmatter.summary} />}
          />
          <CustomAccordionItem
            title={regulation}
            content={<Content content={frontmatter.regulation} />}
          />
          <CustomAccordionItem
            title={conditions}
            content={<Content content={frontmatter.conditions} />}
          />
        </Accordion>

        <Tabs
          display={["none", null, "flex"]}
          orientation="vertical"
          variant="enclosed-colored"
          colorScheme="paleGrey"
        >
          <TabList w="40%">
            {[summary, regulation, conditions].map((option, index) => (
              <Tab key={index} justifyContent="space-between" mb={1}>
                <Text>{option}</Text>
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
            <TabPanel>
              <Content title={summary} content={frontmatter.summary} />
            </TabPanel>
            <TabPanel>
              <Content title={regulation} content={frontmatter.regulation} />
            </TabPanel>
            <TabPanel>
              <Content title={conditions} content={frontmatter.conditions} />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Heading my={[4, null, 8]}>{reservations}</Heading>
        <Box w="full" my={4} textAlign="center">
          <MotionLink
            href="https://booking.campinglamola.com/"
            title={reservations}
            variant="button"
            colorScheme="dullBrown"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            isExternal
          >
            {reservations}
          </MotionLink>
        </Box>

      </Container>
    </>
  )
}

BungalowsPage.propTypes = {
  data: PropTypes.shape({
    html: PropTypes.object,
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default BungalowsPage

export const query = graphql`
  query BungalowsPageTemplateQuery($id: String, $templateKey: String) {
    default: markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        formName
        title
        description
        summary
        regulation
        conditions
      }
    }
    images: markdownRemark(
      fields: { locale: { eq: "ca" }, templateKey: { eq: $templateKey } }
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
