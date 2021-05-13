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
import MotionBox from "../../theme/utils"

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
              src="../../images/LogoRecreat.png"
              alt="Recrea't"
              loading="eager"
              layout="fixed"
              placeholder="tracedSVG"
              width={200}
            />
          </LocalizedLink>
        </MotionBox>

        <ToggleMenu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
          {menuItems.map((menu, index) => (
            <NavLink
              key={index}
              to={menu.link}
              variant={menu.variant}
              onClick={onClose}
            >
              {menu.name}
            </NavLink>
          ))}
        </ToggleMenu>
      </Flex>
    </Box>
  )
}

export default Header
