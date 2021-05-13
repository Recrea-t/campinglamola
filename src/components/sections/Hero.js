import React from "react"

import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Box, Image } from "@chakra-ui/react"

import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const Hero = props => {
  const { images, title, revealRef } = props

  if (images.length > 1) {
    const settings = {
      className: "is-slider",
      dots: true,
      arrows: false,
      infinite: true,
      fade: true,
      autoplay: true,
      speed: 500,
      autoplaySpeed: 5000,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipe: true,
    }
    return (
      <Box pos="relative" w="full" h="calc(100vh - 100px)" ref={revealRef}>
        <Slider {...settings}>
          {images.map((image, index) => (
            <Image
              h="full"
              key={index}
              as={GatsbyImage}
              loading={index === 0 ? "eager" : "lazy"}
              image={getImage(image)}
              alt={title}
            />
          ))}
        </Slider>
      </Box>
    )
  }

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
  }

  return (
    <Box pos="relative" w="full" h="calc(100vh - 100px)" ref={revealRef}>
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
            "linear-gradient(0deg, rgba(236, 249, 246, 0) 80%, #ecf9f6 99%)",
        }}
        as={GatsbyImage}
        loading="eager"
        image={getImage(images[0])}
        alt={title}
        style={backgroundStyle}
      />
    </Box>
  )
}

export default Hero
