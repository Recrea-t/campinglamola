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
import PricingItem from "../components/ui/PricingItem"
import CustomAccordionItem from "../components/ui/CustomAccordionItem"

import { MotionLink } from "../theme/utils"

import { useLocale } from "../hooks/locale"
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

const PlotsPage = props => {
  const { locale } = useLocale()
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
        <Box w="full" my={4} textAlign="center">
          <MotionLink
            href={`https://booking.campinglamola.com/search?lang=${locale}`}
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
          </TabList>
          <TabPanels bg="paleGrey.500" ml={8}>
            <TabPanel key={0}>
              <Content title={summary} content={frontmatter.summary} />
            </TabPanel>
            <TabPanel key={1}>
              <Content title={regulation} content={frontmatter.regulation} />
            </TabPanel>
            <TabPanel key={2}>
              <Content title={conditions} content={frontmatter.conditions} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  )
}

PlotsPage.propTypes = {
  data: PropTypes.shape({
    html: PropTypes.object,
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default PlotsPage

export const query = graphql`
  query PlotsPageTemplateQuery($id: String) {
    default: markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
        description
        summary
        regulation
        conditions
      }
    }
    images: markdownRemark(
      fields: { locale: { eq: "ca" }, templateKey: { eq: "plots-page" } }
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
