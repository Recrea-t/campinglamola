import { mode } from "@chakra-ui/theme-tools"

function variantCustomLink(props) {
  const { colorScheme: c } = props
  const color = mode(`${c}.500`, `${c}.200`)(props)
  const hoverColor = mode(`${c}.700`, `${c}.200`)(props)
  const activeColor = mode(`${c}.700`, `${c}.400`)(props)

  return {
    padding: 0,
    height: "auto",
    lineHeight: "normal",
    color: color,
    _hover: {
      textDecoration: "underline",
      color: color,
      bg: "transparent",
      _disabled: {
        color: color,
        textDecoration: "none",
      },
    },
    _focus: {
      boxShadow: "none",
      color: hoverColor,
    },
    _active: {
      color: activeColor,
    },
  }
}

export default {
  baseStyle: {
    fontWeight: "semibold",
    textTransform: "uppercase",
    _hover: {
      textDecoration: "underline",
      bg: "dullBrown.500",
    },
  },
  variants: {
    "custom-link": variantCustomLink,
  },
}
