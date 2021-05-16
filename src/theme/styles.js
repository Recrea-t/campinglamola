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
            "linear-gradient(0deg, rgba(236, 249, 246, 0) 80%, #ecf9f6 99%)",
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

        button: {
          _before: {
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
              color: "#005321",
            },
          },
        },
      },
    },
  },
}

export default styles
