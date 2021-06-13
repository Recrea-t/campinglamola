import React, { useEffect } from "react"
import useMenu from "../useMenu"
import useTranslations from "../useTranslations"

import { Link as GatsbyLink } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { Flex, Box, useDisclosure } from "@chakra-ui/react"

import NavLink from "../ui/NavLink"
import ToggleMenu from "../ui/ToggleMenu"
import LocalizedLink from "../ui/LocalizedLink"

import { useAnimation } from "framer-motion"
import MotionBox, { EASINGS } from "../../theme/utils"

const Header = ({ inView }) => {
  const menuItems = useMenu()
  const { home } = useTranslations()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const controls = useAnimation()

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    } else {
      controls.start("hidden")
    }
  }, [controls, inView])

  const variants = {
    visible: { opacity: 1, transition: { duration: 0.1 } },
    hidden: { opacity: 0 },
  }

  const menuVariants = {
    visible: {
      opacity: 1,
      z: 0,
    },
    hidden: {
      opacity: 0,
      z: "-10vh",
    },
  }

  return (
    <Box
      as="nav"
      w="full"
      pos="fixed"
      top="0"
      right="0"
      left="0"
      zIndex="1"
      bg="transparent"
      color="paleGrey.500"
    >
      <Flex
        h="full"
        w="full"
        maxW="1200px"
        align="center"
        justify="space-between"
        mx="auto"
        p={4}
        wrap="wrap"
      >
        <MotionBox animate={controls} initial="visible" variants={variants}>
          <LocalizedLink to="/" title={home} as={GatsbyLink}>
            <StaticImage
              src="../../images/Logo.svg"
              alt="Recrea't"
              loading="eager"
              layout="fixed"
              placeholder="tracedSVG"
              width={200}
            />
          </LocalizedLink>
        </MotionBox>

        <ToggleMenu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
          {menuItems.map((menu, index) => {
            const idelay = (6 - index) / 10 + 0.23
            return (
              <NavLink
                key={index}
                to={menu.link}
                variant={menu.variant}
                onClick={onClose}
                variants={menuVariants}
                initial={"hidden"}
                animate={isOpen ? "visible" : "hidden"}
                transition={{
                  z: {
                    ease: [0.165, 0.84, 0.44, 1],
                    duration: 0.91,
                    delay: idelay,
                  },
                  opacity: {
                    duration: 0.91,
                    ease: EASINGS.ease,
                    delay: idelay + 0.05,
                  },
                }}
              >
                {menu.name}
              </NavLink>
            )
          })}
        </ToggleMenu>
      </Flex>
    </Box>
  )
}

export default Header
