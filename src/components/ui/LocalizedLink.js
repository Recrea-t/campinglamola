import React from "react"
import { Link as GatsbyLink } from "gatsby"
import { Link } from "@chakra-ui/react"

import locales from "../../../data/i18n"
import { useLocale } from "../../hooks/locale"
import useLanguageMapping from "../useLanguageMapping"

// Use the globally available context to choose the right path
const LocalizedLink = React.forwardRef(({ to, title, ...props }, ref) => {
  const { locale } = useLocale()
  const languageMapping = useLanguageMapping()

  const isIndex = to === `/`

  if (!isIndex) {
    const associatedUrls = languageMapping.find(item => {
      let hasUrl = false

      Object.entries(item).forEach(([_, value]) => {
        if (value && value.link === to) return (hasUrl = true)
      })

      return hasUrl
    })

    if (associatedUrls) {
      to = `${associatedUrls[locale].link}`
      title = title || associatedUrls[locale].title
    }
  }

  // If it's the default language, don't do anything
  // If it's another language, add the "path"
  // However, if the homepage/index page is linked don't add the "to"
  // Because otherwise this would add a trailing slash
  const path = locales[locale].default
    ? to
    : `/${locales[locale].path}${isIndex ? `` : `${to}`}`

  return <Link as={GatsbyLink} {...props} ref={ref} to={path} title={title} />
})

export default LocalizedLink
