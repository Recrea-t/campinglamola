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

  const {
    bg = `${c}.500`,
    color = "paleGrey.500",
    hoverBg = `${c}.600`,
    activeBg = `${c}.700`,
  } = {}

  const background = mode(bg, `${c}.200`)(props)

  return {
    textDecoration: "none",
    bg: background,
    color: mode(color, `gray.800`)(props),
    _hover: {
      bg: mode(hoverBg, `${c}.300`)(props),
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
