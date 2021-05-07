import React from "react"
import PropTypes from "prop-types"

import { LocaleProvider } from "./locale"

// Wrapping the application with all Contexts
const AppProvider = ({ children }) => (
  <LocaleProvider>{children}</LocaleProvider>
)

AppProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default AppProvider

