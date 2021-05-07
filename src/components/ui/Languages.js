import React from "react"
import { Link as GatsbyLink, navigate } from "gatsby"

import locales from "../../../data/i18n"
import { useLocale } from "../../hooks/locale"
import useLanguageMapping from "../useLanguageMapping"

import { HStack, Link } from "@chakra-ui/react"

const Languages = () => {
  // Grab the locale (passed through context) from the Locale Provider
  // through useLocale() hoo
  const { locale } = useLocale()
  const languageMapping = useLanguageMapping()

  function handleClickLanguage(lang, options = { replace: true }) {
    if (locale === lang) return

    localStorage.setItem("gatsby-language", lang)

    const url = window.location.pathname.split("/").pop()

    if (!url || url === lang)
      return locales[lang].default
        ? navigate(`/`, options)
        : navigate(`/${lang}`, options)

    const associatedUrls = languageMapping.find(item => {
      let hasUrl = false

      Object.entries(item).forEach(([_, value]) => {
        if (value && value.link.split("/").pop() === url) return (hasUrl = true)
      })

      return hasUrl
    })

    if (!associatedUrls)
      return locales[lang].default
        ? navigate(`/`, options)
        : navigate(`/${lang}`, options)

    return locales[lang].default
      ? navigate(`${associatedUrls[lang].link}`, options)
      : navigate(`/${lang}${associatedUrls[lang].link}`, options)
  }

  if (typeof window !== "undefined") {
    let detected = window.localStorage.getItem("gatsby-language") || locale

    if (locale !== detected) {
      handleClickLanguage(detected, { replace: true })
    }
  }

  return (
    <HStack spacing={4}>
      <Link
        to="/"
        title="Català"
        as={GatsbyLink}
        variant="nav-link"
        onClick={e => {
          e.preventDefault()
          handleClickLanguage("ca")
        }}
        className={locale === "ca" ? "is-active" : ""}
      >
        CAT
      </Link>
      <Link
        to="/"
        title="Español"
        as={GatsbyLink}
        variant="nav-link"
        onClick={e => {
          e.preventDefault()
          handleClickLanguage("es")
        }}
        className={locale === "es" ? "is-active" : ""}
      >
        ES
      </Link>
      <Link
        to="/"
        title="English"
        as={GatsbyLink}
        variant="nav-link"
        onClick={e => {
          e.preventDefault()
          handleClickLanguage("en")
        }}
        className={locale === "en" ? "is-active" : ""}
      >
        ENG
      </Link>
    </HStack>
  )
}

export default Languages
