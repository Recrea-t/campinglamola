import { mode } from "@chakra-ui/theme-tools"

function variantButton(props) {
  const { colorScheme: c } = props

  if (c === "gray") {
    const bg = mode(`gray.100`, `whiteAlpha.200`)(props)

    return {
      bg,
      _hover: {
        bg: mode(`gray.200`, `whiteAlpha.300`)(props),
        _disabled: {
          bg,
        },
      },
      _active: { bg: mode(`gray.300`, `whiteAlpha.400`)(props) },
    }
  }

  const { bg = `${c}.500`, color = "paleGrey.500", activeBg = `${c}.700` } = {}

  const background = mode(bg, `${c}.200`)(props)

  return {
    h: 10,
    minW: 10,
    py: 1,
    px: 4,
    fontWeight: "semibold",
    textDecoration: "none",
    bg: background,
    color: mode(color, `gray.800`)(props),
    _hover: {
      textDecoration: "underline",
      color: mode(color, `gray.800`)(props),
      _disabled: {
        bg: background,
      },
    },
    _active: { bg: mode(activeBg, `${c}.400`)(props) },
  }
}

export default {
  baseStyle: {
    color: "dullBrown.500",
    textDecoration: "underline",
    lineHeight: 1.5,
    boxShadow: "none",
    _hover: {
      textDecoration: "none",
    },
    _focus: {
      boxShadow: "none",
    },
  },
  variants: {
    button: variantButton,
    "nav-link-lg": {
      color: "dullBrown.500",
      fontSize: "md",
      textDecoration: "none",
      fontWeight: "semibold",
      textTransform: "uppercase",
      textAlign: "center",
      _hover: {
        textDecoration: "underline",
      },
      pr: { base: 2, lg: 8 },
      pl: { base: 2, lg: 8 },
    },
    "nav-link": {
      color: "paleGrey.500",
      fontSize: "2rem",
      textDecoration: "none",
      fontWeight: "semibold",
      textTransform: "uppercase",
      textAlign: "center",
      _hover: {
        textDecoration: "underline",
      },
    },
    "nav-sublink": {
      color: "paleGrey.500",
      fontSize: "2rem",
      textDecoration: "none",
      textAlign: "center",
      _hover: {
        textDecoration: "underline",
      },
    },
    "in-card": {
      fontSize: "4xl",
      color: "paleGrey.500",
      textDecoration: "none",
      _hover: {
        textDecoration: "underline",
      },
    },
    "in-footer-dark": {
      color: "paleGrey.500",
    },
    "in-footer-light": {
      color: "darkIndigo.500",
      textDecoration: "none",
      _hover: {
        textDecoration: "underline",
      },
    },
  },
}
