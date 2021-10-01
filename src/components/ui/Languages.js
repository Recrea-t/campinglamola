import React from "react"
import { Link as GatsbyLink, navigate } from "gatsby"

import locales from "../../../data/i18n"
import { useLocale } from "../../hooks/locale"
import useLanguageMapping from "../useLanguageMapping"

import { Center, HStack, Link, StackDivider } from "@chakra-ui/react"
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"
import { TriangleDownIcon } from "@chakra-ui/icons"

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
    <>
      <Menu display={{ base: "none", md: "block" }} matchWidth={true}>
        <MenuButton
          as={Link}
          variant="nav-link-lg"
          rightIcon={<TriangleDownIcon />}
        >
          {locales[locale].title}
        </MenuButton>
        <MenuList>
          <MenuItem>
            <Link
              to="/"
              title="Català"
              as={GatsbyLink}
              variant="nav-link-lg"
              onClick={e => {
                e.preventDefault()
                handleClickLanguage("ca")
              }}
            >
              CAT
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/"
              title="Español"
              as={GatsbyLink}
              variant="nav-link-lg"
              onClick={e => {
                e.preventDefault()
                handleClickLanguage("es")
              }}
            >
              ES
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/"
              title="English"
              as={GatsbyLink}
              variant="nav-link-lg"
              onClick={e => {
                e.preventDefault()
                handleClickLanguage("en")
              }}
            >
              ENG
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/"
              title="Français"
              as={GatsbyLink}
              variant="nav-link-lg"
              onClick={e => {
                e.preventDefault()
                handleClickLanguage("fr")
              }}
            >
              FR
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/"
              title="Nederlands"
              as={GatsbyLink}
              variant="nav-link-lg"
              onClick={e => {
                e.preventDefault()
                handleClickLanguage("nl")
              }}
            >
              NL
            </Link>
          </MenuItem>
        </MenuList>
      </Menu>

      <Center w="full" display={{ base: "block", md: "none" }}>
        <HStack spacing={2} divider={<StackDivider my="8px !important" />}>
          <Link
            to="/"
            title="Català"
            as={GatsbyLink}
            variant={locale === "ca" ? "nav-link" : "nav-sublink"}
            onClick={e => {
              e.preventDefault()
              handleClickLanguage("ca")
            }}
          >
            CAT
          </Link>
          <Link
            to="/"
            title="Español"
            as={GatsbyLink}
            variant={locale === "es" ? "nav-link" : "nav-sublink"}
            onClick={e => {
              e.preventDefault()
              handleClickLanguage("es")
            }}
          >
            ES
          </Link>
          <Link
            to="/"
            title="English"
            as={GatsbyLink}
            variant={locale === "en" ? "nav-link" : "nav-sublink"}
            onClick={e => {
              e.preventDefault()
              handleClickLanguage("en")
            }}
          >
            ENG
          </Link>
          <Link
            to="/"
            title="Français"
            as={GatsbyLink}
            variant={locale === "fr" ? "nav-link" : "nav-sublink"}
            onClick={e => {
              e.preventDefault()
              handleClickLanguage("fr")
            }}
          >
            FR
          </Link>
          <Link
            to="/"
            title="Nederlands"
            as={GatsbyLink}
            variant={locale === "nl" ? "nav-link" : "nav-sublink"}
            onClick={e => {
              e.preventDefault()
              handleClickLanguage("nl")
            }}
          >
            NL
          </Link>
        </HStack>
      </Center>
    </>
  )
}

export default Languages
