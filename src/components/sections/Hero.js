import React from "react"
import useTranslations from "../useTranslations"

import { Flex, Box, Container, Text } from "@chakra-ui/react"
import { MotionButton } from "../../theme/utils"
import LocalizedLink from "../ui/LocalizedLink"

const Hero = props => {
  const { frontmatter } = props.data.markdownRemark
  const { moreButton } = useTranslations()
  return (
    <Box w="full" mb={8} py={4} bg="mangoTango.500" color="white">
      <Container>
        <Flex direction="column">
          <Text
            as="h1"
            fontFamily="Playfair Display"
            fontSize={{ base: "2xl", md: "6xl" }}
          >
            “{frontmatter.description}”
          </Text>
          <MotionButton
            as={LocalizedLink}
            to="/qui-som"
            title="Qui som?"
            variant="custom-link"
            colorScheme="white"
            alignSelf="flex-end"
            whileTap={{ scale: 0.95 }}
          >
            {moreButton}
          </MotionButton>
        </Flex>
      </Container>
    </Box>
  )
}

export default Hero
