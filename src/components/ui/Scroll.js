import React, { useState, useEffect } from "react"
import { Box, IconButton } from "@chakra-ui/react"
import { TriangleUpIcon } from "@chakra-ui/icons"

const Scroll = ({ showBelow }) => {
  const [show, setShow] = useState(showBelow ? false : true)

  const handleScroll = () => {
    if (window.pageYOffset > showBelow) {
      if (!show) setShow(true)
    } else {
      if (show) setShow(false)
    }
  }

  const handleClick = () => {
    window[`scrollTo`]({ top: 0, behavior: `smooth` })
  }

  useEffect(() => {
    if (showBelow) {
      window.addEventListener(`scroll`, handleScroll)
      return () => window.removeEventListener(`scroll`, handleScroll)
    }
  })

  return (
    <Box>
      {show && (
        <IconButton
          zIndex="2"
          pos="fixed"
          bottom="2vh"
          colorScheme="nero"
          right={["5%", "5%", "6.5%"]}
          onClick={handleClick}
          aria-label="to top"
        >
          <TriangleUpIcon />
        </IconButton>
      )}
    </Box>
  )
}

export default Scroll
