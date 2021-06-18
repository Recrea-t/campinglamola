import React from "react"

import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Box, Image } from "@chakra-ui/react"

import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const Hero = props => {
  const { images, title, revealRef, language, isEmpty } = props

  if (isEmpty) {
    return <Box pos="relative" w="full" h="150px" ref={revealRef}></Box>
  }

  if (!images || images.length === 0) {
    return (
      <Box
        pos="relative"
        w="full"
        h="calc(100vh - 5rem)"
        ref={revealRef}
        mt={100}
      >
        <iframe
          width="100%"
          height="100%"
          title="Google Map · Càmping La Mola"
          alt="Google Map · Càmping La Mola"
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.GATSBY_GOOGLE_API_KEY}&language=${language}&q=campinglamola&zoom=12`}
          aria-hidden="false"
          loading="lazy"
          frameborder="0"
          style={{ border: 0 }}
          allowFullScreen
        />
      </Box>
    )
  }

  if (images.length > 1) {
    const settings = {
      className: "is-slider",
      dots: true,
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
      <Box pos="relative" w="full" h="calc(100vh - 5rem)" ref={revealRef}>
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
    <Box pos="relative" w="full" h="calc(100vh - 5rem)" ref={revealRef}>
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
            "linear-gradient(0deg, rgba(236, 249, 246, 0) 42%, #ecf9f6 100%)",
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
