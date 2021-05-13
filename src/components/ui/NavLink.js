import React from "react"
import { MotionText } from "../../theme/utils"
import LocalizedLink from "../ui/LocalizedLink"

const NavLink = props => {
  const { children, variant, onClick, isLast, to = "/", ...rest } = props

  const isPartiallyActive = props => {
    return props.isPartiallyCurrent
      ? { style: { textDecoration: "underline" } }
      : {}
  }

  return (
    <MotionText display="block" whileTap={{ scale: 0.95 }} {...rest}>
      <LocalizedLink
        to={to}
        variant={variant}
        getProps={isPartiallyActive}
        onClick={onClick}
      >
        {children}
      </LocalizedLink>
    </MotionText>
  )
}

export default NavLink
