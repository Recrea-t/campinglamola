import React, { createContext, useState, useContext } from "react"
import PropTypes from "prop-types"

import browserLang from "browser-lang"
import locales from "../../data/i18n"

const LocaleContext = createContext("")

const languages = Object.keys(locales)
const key = "gastby-language"
const defaultLang = "ca"

const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    let detected = defaultLang

    if (typeof window !== "undefined") {
      detected = window.localStorage.getItem(key)

      if (!detected) {
        detected = browserLang({
          languages,
          fallback: defaultLang,
        })

        if (!languages.includes(detected)) {
          detected = defaultLang
        }
        window.localStorage.setItem(key, detected)
      }
    }
    return detected
  })

  function changeLocale(lang) {
    setLocale(lang)
  }

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

LocaleProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

const useLocale = () => {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error("useLocale must be used within an LocaleProvider")
  }
  return context
}

export { LocaleProvider, useLocale }
