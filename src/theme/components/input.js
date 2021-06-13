export default {
  variants: {
    filled: {
      field: {
        border: "2px solid",
        borderColor: "transparent",
        bg: "paleGrey.500",
        _hover: {
          bg: "paleGrey.500",
        },
        _readOnly: {
          boxShadow: "none !important",
          userSelect: "all",
        },
        _disabled: {
          opacity: 0.4,
          cursor: "not-allowed",
        },
        _invalid: {
          borderColor: "paleGrey.700",
        },
        _focus: {
          bg: "paleGrey.500",
          borderColor: "dullBrown.500",
        },
      },
      addon: {
        border: "2px solid",
        borderColor: "transparent",
      },
    },
  },
}
