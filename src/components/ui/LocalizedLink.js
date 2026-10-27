import React from "react"
import { Link as GatsbyLink } from "gatsby"
import { Link } from "@chakra-ui/react"

import locales from "../../../data/i18n"
import { useLocale } from "../../hooks/locale"
import useLanguageMapping from "../useLanguageMapping"

// Use the globally available context to choose the right path
const LocalizedLink = React.forwardRef(
  ({ to, title, children, ...props }, ref) => {
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
    // Pages are published with a trailing slash: without it the link gets a 301
    const localized = locales[locale].default
      ? to
      : `/${locales[locale].path}${to}`
    const path = localized.endsWith(`/`) ? localized : `${localized}/`

    if (!children) {
      children = <span>{title}</span>
    }
    return (
      <Link
        as={GatsbyLink}
        {...props}
        ref={ref}
        to={path}
        title={title}
        children={children}
      />
    )
  }
)

export default LocalizedLink
