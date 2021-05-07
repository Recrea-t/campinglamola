import React from "react"
import { MotionText } from "../../theme/utils"
import LocalizedLink from "../ui/LocalizedLink"

const NavLink = props => {
  const { children, onClick, isLast, to = "/", ...rest } = props

  const isPartiallyActive = props => {
    return props.isPartiallyCurrent ? { style: { color: "#63656A" } } : {}
  }

  return (
    <MotionText
      mb={{ base: isLast ? 0 : 8, sm: 0 }}
      mr={{ base: 0, sm: isLast ? 0 : 8 }}
      display="block"
      whileTap={{ scale: 0.95 }}
      {...rest}
    >
      <LocalizedLink
        to={to}
        variant="nav-link"
        getProps={isPartiallyActive}
        onClick={onClick}
      >
        {children}
      </LocalizedLink>
    </MotionText>
  )
}

export default NavLink
