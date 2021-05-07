import React from "react"
import { motion, isValidMotionProp } from "framer-motion"
import {
  Box,
  forwardRef,
  VStack,
  HStack,
  Button,
  GridItem,
  Image,
  Text,
  Link,
} from "@chakra-ui/react"

export const EASINGS = {
  ease: [0.25, 0.1, 0.25, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  easeInCubic: [0.32, 0, 0.67, 0],
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeInOutBack: [0.34, 1.56, 0.64, 1],
}

export const revealVariants = (direction = "right", index = 0) => {
  let x = direction === "right" ? "-100px" : 0
  let y = direction === "top" ? "-100px" : 0

  if (direction === "left") x = "100px"
  if (direction === "bottom") y = "100px"

  const delay = 0.3 * index

  return {
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.6, ease: EASINGS.easeOutCubic, delay: delay },
    },
    hidden: { opacity: 0, x: x, y: y },
  }
}

export const motionConfig = (controls, initial, variants) => {
  return {
    animate: controls,
    initial: initial,
    variants: variants,
  }
}

export const motionRevealConfig = (
  controls,
  direction = "right",
  index = 0
) => {
  return motionConfig(controls, "hidden", revealVariants(direction, index))
}

const MotionBox = motion(
  forwardRef((props, ref) => {
    const chakraProps = Object.fromEntries(
      // do not pass framer props to DOM element
      Object.entries(props).filter(([key]) => !isValidMotionProp(key))
    )
    return <Box ref={ref} {...chakraProps} />
  })
)

export const MotionVStack = motion(
  forwardRef((props, ref) => {
    const chakraProps = Object.fromEntries(
      // do not pass framer props to DOM element
      Object.entries(props).filter(([key]) => !isValidMotionProp(key))
    )
    return <VStack ref={ref} {...chakraProps} />
  })
)

export const MotionHStack = motion(
  forwardRef((props, ref) => {
    const chakraProps = Object.fromEntries(
      // do not pass framer props to DOM element
      Object.entries(props).filter(([key]) => !isValidMotionProp(key))
    )
    return <HStack ref={ref} {...chakraProps} />
  })
)

export const MotionGridItem = motion(
  forwardRef((props, ref) => {
    const chakraProps = Object.fromEntries(
      // do not pass framer props to DOM element
      Object.entries(props).filter(([key]) => !isValidMotionProp(key))
    )
    return <GridItem ref={ref} {...chakraProps} />
  })
)

export const MotionButton = motion(
  forwardRef((props, ref) => {
    const chakraProps = Object.fromEntries(
      // do not pass framer props to DOM element
      Object.entries(props).filter(([key]) => !isValidMotionProp(key))
    )
    return <Button ref={ref} {...chakraProps} />
  })
)

export const MotionImage = motion(
  forwardRef((props, ref) => {
    const chakraProps = Object.fromEntries(
      // do not pass framer props to DOM element
      Object.entries(props).filter(([key]) => !isValidMotionProp(key))
    )
    return <Image ref={ref} {...chakraProps} />
  })
)

export const MotionText = motion(
  forwardRef((props, ref) => {
    const chakraProps = Object.fromEntries(
      // do not pass framer props to DOM element
      Object.entries(props).filter(([key]) => !isValidMotionProp(key))
    )
    return <Text ref={ref} {...chakraProps} />
  })
)

export const MotionLink = motion(
  forwardRef((props, ref) => {
    const chakraProps = Object.fromEntries(
      // do not pass framer props to DOM element
      Object.entries(props).filter(([key]) => !isValidMotionProp(key))
    )
    return <Link ref={ref} {...chakraProps} />
  })
)

export default MotionBox
