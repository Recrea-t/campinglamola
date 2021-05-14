import React, { useEffect } from "react"

import { Heading, Image } from "@chakra-ui/react"

import { useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { motionRevealConfig, MotionVStack } from "../../theme/utils"

const ServiceSmallCard = props => {
  const controls = useAnimation()
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  console.log(props.image)
  return (
    <MotionVStack
      ref={ref}
      textAlign="center"
      justify="center"
      {...motionRevealConfig(controls, "bottom", props.index)}
    >
      <Image alt={props.title} src={props.image.publicURL} />
      <Heading variant="in-box" textAlign="center">
        {props.title}
      </Heading>
    </MotionVStack>
  )
}

export default ServiceSmallCard
