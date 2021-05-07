import React from "react"
import { Box, Flex, HStack, Text, StackDivider } from "@chakra-ui/react"
import LocalizedLink from "../ui/LocalizedLink"

import useTranslations from "../useTranslations"

const Footer = props => {
  const { legalNote, privacyPolicy } = useTranslations()

  return (
    <Flex
      as="footer"
      align="center"
      justify="center"
      w="full"
      p={4}
      bg="dimGray.500"
      color="white"
      {...props}
    >
      <Box>
        <HStack spacing={2} divider={<StackDivider />} fontSize="xs">
          <Text>
            &copy; {new Date().getFullYear()} {props.title}
          </Text>
          <LocalizedLink to="/avis-legal">{legalNote}</LocalizedLink>
          <LocalizedLink to="/proteccio-de-dades">
            {privacyPolicy}
          </LocalizedLink>
        </HStack>
      </Box>
    </Flex>
  )
}

export default Footer
