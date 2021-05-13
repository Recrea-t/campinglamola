import "@fontsource/poppins"
import "@fontsource/poppins/600.css" // Semi-bold

import React from "react"
import useSiteMetadata from "./siteMetadata"
import { useLocale } from "../hooks/locale"

import { Flex } from "@chakra-ui/react"

import Header from "./sections/Header"
import Footer from "./sections/Footer"
import Hero from ".//sections/Hero"

import { useInView } from "react-intersection-observer"

const TemplateWrapper = ({ data, children, pageContext: { locale } }) => {
  const { frontmatter } = data.markdownRemark
  const { defaultTitle } = useSiteMetadata()
  const { changeLocale } = useLocale()
  changeLocale(locale)

  const [ref, inView] = useInView()

  return (
    <Flex
      direction="column"
      align="center"
      justify="space-between"
      overflow="hidden"
      minH="100vh"
      pos="relative"
    >
      <Header inView={inView} />
      <Flex as="main" pos="relative" w="full" direction="column">
        <Hero
          title={frontmatter.title}
          images={frontmatter.images}
          revealRef={ref}
        />
        {children}
      </Flex>
      <Footer title={defaultTitle} />
    </Flex>
  )
}

export default TemplateWrapper
