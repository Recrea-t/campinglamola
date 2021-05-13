import React, { useEffect, useState, useRef } from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Box, Center, Image, Text } from "@chakra-ui/react"

const BackgroundSlider = ({
  callbacks = {},
  duration = 5,
  transition = 2,
  initDelay = 5,
  images,
  title,
}) => {
  let bgRefs = []
  let bgWrappers = []
  let buttonRefs = []

  const imgs = images.map((image, index) => {
    const backgroundStyle = {
      position: "absolute",
      zIndex: -10,
      width: "100%",
      height: "100%",
      margin: 0,
      padding: "none",
      left: 0,
      top: 0,
      backgroundSize: "cover",
      opacity: index ? 0 : 1,
      transition: `opacity ${transition}s`,
    }

    bgRefs[index] = React.createRef()

    return (
      <React.Fragment key={index}>
        <Box ref={bgRefs[index]}>
          <Image
            _before={{
              content: "''",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
              background:
                "linear-gradient(0deg, rgba(255, 255, 255, 0) 10%, #fff 90%)",
            }}
            as={GatsbyImage}
            loading="eager"
            alt={title}
            image={getImage(image)}
            style={backgroundStyle}
          />
        </Box>
      </React.Fragment>
    )
  })

  const [timeoutHandle, setTimeoutHandle] = useState(0)
  const timeoutHandleRef = useRef(timeoutHandle)
  timeoutHandleRef.current = timeoutHandle
  const [index, setIndex] = useState(0)
  const indexRef = useRef(index)
  indexRef.current = index

  callbacks.getCount = () => imgs.length

  const clearAndSetTimeoutHandle = newTimeoutHandle => {
    clearTimeout(timeoutHandleRef.current)
    setTimeoutHandle(newTimeoutHandle)
  }

  const initEffect = () => {
    bgRefs.forEach(bgRef => {
      bgWrappers.push(bgRef.current.firstElementChild)
    })

    callbacks.onChange = (prevIndex, newIndex) => {
      console.log("onchange")
      console.log(buttonRefs)
      if (buttonRefs[prevIndex].current) {
        buttonRefs[newIndex].current.style.color = "#005321"
      }
      if (buttonRefs[newIndex].current) {
        buttonRefs[prevIndex].current.style.color = "#ecf9f6"
      }
    }

    const length = bgWrappers.length

    const changeIndex = newIndex => {
      console.log("changeIndex")
      console.log(buttonRefs)
      const index = indexRef.current
      clearTimeout(timeoutHandleRef.current)

      bgWrappers[index].style.opacity = 0
      bgWrappers[newIndex % length].style.opacity = 1

      callbacks.onChange(index, newIndex % length)

      setIndex(newIndex % length)
      clearAndSetTimeoutHandle(setTimeout(callback, duration * 1000))
    }

    const callback = function () {
      const index = indexRef.current
      changeIndex(index + 1)
    }

    clearAndSetTimeoutHandle(setTimeout(callback, initDelay * 1000))

    callbacks.atIndex = changeIndex

    callbacks.next = () => callbacks.atIndex((indexRef.current + 1) % length)
    callbacks.prev = () =>
      callbacks.atIndex((indexRef.current + length - 1) % length)

    return () => {
      clearTimeout(timeoutHandleRef.current)
    }
  }

  // Runs once after DOM is loaded; effectively `componentDidMount`
  useEffect(initEffect, [])

  return (
    <Box pos="relative" w="full" h="calc(100vh - 100px)">
      {imgs}

      <Center w="full" pos="absolute" bottom={[0, null, 4]}>
        {Array.from(Array(callbacks.getCount()).keys()).map(index => (
          <span
            key={index}
            ref={(buttonRefs[index] = React.createRef())}
            display="inline-block"
            role="button"
            cursor="pointer"
            width="20px"
            height="20px"
            margin="0 5px"
            padding={0}
            background="transparent"
            color={index === 0 ? "deepGreen.500" : "paleGrey.500"}
            fontSize="3rem"
            lineHeight="20px"
            opacity={0.75}
            _hover={{
              outline: "none",
              opacity: 1,
            }}
            _focus={{
              outline: "none",
              opacity: 1,
            }}
            onClick={() => callbacks.atIndex(index)}
          >
            &middot;
          </span>
        ))}
      </Center>
    </Box>
  )
}

export default BackgroundSlider
