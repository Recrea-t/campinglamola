import "@fontsource/poppins"
import "@fontsource/poppins/600.css" // Semi-bold
import "@fontsource/poppins/800.css" // extrabold

import React from "react"
import useSiteMetadata from "./siteMetadata"
import { useLocale } from "../hooks/locale"

import { Flex } from "@chakra-ui/react"

import Header from "./sections/Header"
import Footer from "./sections/Footer"
import Hero from ".//sections/Hero"

import { useInView } from "react-intersection-observer"

const TemplateWrapper = ({
  data,
  children,
  pageContext: { locale, templateKey },
}) => {
  let frontmatter = data && data.default ? data.default.frontmatter : {}
  let images = data && data.images ? data.images.frontmatter.images : []
  const { defaultTitle } = useSiteMetadata()
  const { changeLocale } = useLocale()
  changeLocale(locale)

  const [ref, inView] = useInView({ threshold: 0.9 })

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
        {frontmatter && (
          <Hero
            revealRef={ref}
            title={frontmatter.title}
            images={images}
            language={locale}
            isEmpty={templateKey === "general-page"}
          />
        )}
        {children}
      </Flex>
      <Footer title={defaultTitle} />
    </Flex>
  )
}

export default TemplateWrapper
