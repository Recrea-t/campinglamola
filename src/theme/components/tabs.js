export default {
  variants: {
    "enclosed-colored": {
      tab: {
        border: "0",
        color: "paleGrey.500",
        bg: "dullBrown.500",
        fontWeight: "semibold",
        textTransform: "uppercase",
        _focus: {
          boxShadow: "none",
        },
        _hover: {
          bg: "dullBrown.600",
        },
        _notLast: {
          marginRight: "0",
        },
        _selected: {
          textAlign: "left",
          bg: "paleGrey.500",
          color: "dullBrown.500",
          _hover: {
            bg: "paleGrey.600",
          },
        },
      },
      tablist: {
        border: "0",
        w: "40%",
      },
    },
  },
}
