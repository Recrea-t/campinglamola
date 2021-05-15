import React from "react"

import {
  Heading,
  Image,
  Stack,
  VStack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"

const ServiceCard = props => {
  const isSmallDevice = useBreakpointValue({ base: true, md: false })

  const isEven = isSmallDevice && props.index % 2 == 0

  return (
    <VStack
      w="full"
      h="auto"
      p={4}
      spacing={4}
      mb={8}
      color="dullBrown.500"
      bg="paleGrey.500"
      display="inline-block"
      whiteSpace="pre-wrap"
    >
      <Stack
        w="full"
        spacing={4}
        direction={isEven ? "row-reverse" : "row"}
        align="center"
        justify="start"
      >
        <Image alt={props.title} src={props.image.publicURL} />
        <Heading variant="in-box" textAlign="center">
          {props.title}
        </Heading>
      </Stack>
      {props.description && <Text w="full">{props.description}</Text>}
    </VStack>
  )
}

export default ServiceCard
