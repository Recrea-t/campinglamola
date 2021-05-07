import React from "react"
import PropTypes from "prop-types"
import useTranslations from "../useTranslations"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import { HStack, Heading, Text, Box, Tag, VStack } from "@chakra-ui/react"
import LocalizedLink from "./LocalizedLink"

const PostCard = ({
  slug,
  tags,
  date,
  timeToRead,
  title,
  description,
  image,
}) => {
  const { toRead } = useTranslations()

  return (
    <VStack as="article" spacing={4} bg="cultured.500">
      <Box pos="relative">
        <GatsbyImage alt={title} image={getImage(image)} />
        {/*<StaticImage
          src="https://picsum.photos/320/240"
          width="100%"
          alt={title}
        />*/}

        <HStack
          spacing={4}
          align="center"
          pos="absolute"
          bottom="-.25rem"
          right={4}
          zIndex="1"
        >
          {tags.map(tag => (
            <Tag size="md" key={tag} variant="solid" colorScheme="mangoTango">
              {tag}
            </Tag>
          ))}
        </HStack>
      </Box>

      <Box as="time" dateTime={date} alignSelf="start" px={4}>
        {date} • {timeToRead} min {toRead}
      </Box>

      <Heading size="md" m={0} textAlign="start" alignSelf="start" px={4}>
        <LocalizedLink to={slug} title={title}>
          {title}
        </LocalizedLink>
      </Heading>
      <Text px={4} pb={8}>
        {description}
      </Text>
    </VStack>
  )
}

PostCard.propTypes = {
  slug: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  timeToRead: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

export default PostCard
