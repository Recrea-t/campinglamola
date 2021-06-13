const styles = {
  global: {
    html: {
      //scrollBehavior: "smooth",
    },
    body: {
      color: "darkIndigo.500",
    },
    ".markdown": {
      li: {
        margin: "0 !important",
      },
    },
    ".is-active": {
      color: "#63656A !important",
      textDecoration: "none",
    },
    ".chakra-table": {
      td: {
        py: ".5rem",
      },
    },
    ".chakra-tabs__tablist": {
      button: {
        textAlign: "left !important",
      },
    },
    ".is-slider": {
      position: "relative",
      width: "100%",
      height: "100%",
      margin: 0,
      padding: 0,

      ".slick-slide": {
        padding: "0 2rem",
        overflow: "hidden",

        _before: {
          content: "''",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          background:
            "linear-gradient(0deg, rgba(236, 249, 246, 0) 42%, #ecf9f6 100%)",
        },
      },
      ".slick-list": {
        height: "100%",
        margin: "0 -2rem",

        ".slick-track": {
          height: "100%",

          ".slick-slide": {
            height: "100%",

            "> div": {
              height: "100%",
            },
          },
        },
      },
      ".slick-dots": {
        position: "absolute",
        bottom: "1rem",

        li: {
          margin: "0",
        },

        button: {
          _before: {
            fontSize: ".75rem",
            color: "#ecf9f6",
            opacity: 0.75,

            _hover: {
              opacity: 1,
            },
          },
        },

        ".slick-active": {
          button: {
            _before: {
              fontSize: "1rem",
              color: "#005321",
              textShadow:
                "-1px 0 #ecf9f6, 0 1px #ecf9f6, 1px 0 #ecf9f6, 0 -1px #ecf9f6",
            },
          },
        },
      },
    },
    ".react-datepicker": {
      fontFamily: "unset",
      fontSize: ".9em",
    },
    ".react-datepicker-wrapper": {
      display: "block",
    },
    ".react-datepicker__input-container": {
      display: "block",
      px: "1rem",
      h: "2.5rem",
      border: "2px solid",
      borderColor: "transparent",
      bg: "#ecf9f6",
      _hover: {
        bg: "#c7ede5",
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
        borderColor: "#a6e2d6",
      },
      _focus: {
        bg: "#ecf9f6",
        borderColor: "#a6e2d6",
      },
      input: {
        width: "100%",
        height: "100%",
        outline: 0,
        bg: "transparent",

        _placeholder: {
          color: "#0a2840",
        },
      },
    },
    ".react-datepicker__triangle": {
      _before: {
        borderBottomColor: "#80704a !important",
      },
    },
    ".react-datepicker__header": {
      bg: "#80704a",
      color: "#ecf9f6",
    },
    ".react-datepicker__current-month": {
      color: "#ecf9f6",
      fontWeight: "semibold",
    },
    ".react-datepicker__day-name": {
      color: "#ecf9f6",
    },
    ".react-datepicker-time__header": {
      color: "#ecf9f6",
      fontWeight: "semibold",
    },
    ".react-datepicker-year-header": {
      color: "#ecf9f6",
      fontWeight: "semibold",
    },
    ".react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item":
      {
        margin: "0 1px 0 0",
        height: "auto",
        padding: "7px 10px",
        _hover: {
          background: "#C7EDE5",
        },
      },

    ".react-datepicker__day": {
      _hover: {
        background: "#C7EDE5",
      },
    },

    ".react-datepicker__day--selected": {
      color: "#0a2840",
      background: "#ecf9f6",
      fontWeight: "normal",
    },
    ".react-datepicker__day--in-selecting-range": {
      background: "#ecf9f6",
      fontWeight: "normal",
    },
    ".react-datepicker__day--in-range": {
      background: "#ecf9f6",
      fontWeight: "normal",
    },
    ".react-datepicker__month-text--selected": {
      background: "#ecf9f6",
      fontWeight: "normal",
    },
    ".react-datepicker__month-text--in-selecting-range": {
      background: "#ecf9f6",
      fontWeight: "normal",
    },
    ".react-datepicker__month-text--in-range": {
      background: "#ecf9f6",
      fontWeight: "normal",
    },
    ".react-datepicker__day--keyboard-selected, .react-datepicker__month-text--keyboard-selected, .react-datepicker__quarter-text--keyboard-selected, .react-datepicker__year-text--keyboard-selected":
      {
        color: "#0a2840",
        background: "#ecf9f6",
        fontWeight: "normal",
      },
    ".react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected":
      {
        background: "#ecf9f6",
        fontWeight: "normal",
        _hover: {
          background: "#C7EDE5",
        },
      },

    ".react-datepicker__close-icon": {
      _after: {
        backgroundColor: "unset",
        borderRadius: "unset",
        fontSize: "1.5rem",
        fontWeight: "semibold",
        color: "hsl(0,0%,80%)",
        height: "20px",
        width: "20px",
      },
    },

    ".react-datepicker__navigation--previous": {
      borderRightColor: "#ecf9f6",
      _hover: {
        borderRightColor: "#ffffff",
      },
    },
    ".react-datepicker__navigation--next": {
      borderLeftColor: "#ecf9f6",
      _hover: {
        borderLeftColor: "#ffffff",
      },
    },
    ".react-datepicker__triangle": {
      borderBottomColor: "#80704a !important",
    },
    ".react-datepicker__close-icon": {
      _after: {
        _hover: {
          color: "hsl(0,0%,70%)",
        },
      },
    },
  },
}

export default styles
