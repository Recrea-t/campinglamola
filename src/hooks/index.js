import React from "react"
import PropTypes from "prop-types"

import { LocaleProvider } from "./locale"

// Wrapping the application with all Contexts
const AppProvider = ({ locale, children }) => (
  <LocaleProvider locale={locale}>{children}</LocaleProvider>
)

AppProvider.propTypes = {
  locale: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default AppProvider

