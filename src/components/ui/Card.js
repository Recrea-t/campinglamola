import React, { useEffect } from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import { Center } from "@chakra-ui/react"
import LocalizedLink from "./LocalizedLink"

import { useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import MotionBox, { motionRevealConfig } from "../../theme/utils"

const Card = ({ index, title, url, image }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <MotionBox
      ref={ref}
      maxW="sm"
      p={4}
      display="grid"
      whileTap={{ scale: 0.95 }}
      {...motionRevealConfig(controls, "bottom", index)}
    >
      <GatsbyImage
        style={{
          borderRadius: ".5rem",
          gridArea: "1/1",
        }}
        alt={title}
        image={getImage(image)}
      />
      <Center
        gridArea="1/1"
        pos="relative"
        display="grid"
        rounded="xl"
        _before={{
          content: "''",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          opacity: 0.5,
          borderRadius: "var(--chakra-radii-xl)",
          background: "dullBrown.500",
        }}
      >
        <LocalizedLink to={url} variant="in-card" zIndex={2} textAlign="center">
          {title}
        </LocalizedLink>
      </Center>
    </MotionBox>
  )
}

export default Card
