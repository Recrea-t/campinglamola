import React from "react"
import useMenu from "../useMenu"
import useSiteMetadata from "../siteMetadata"
import useTranslations from "../useTranslations"

import { Link as GatsbyLink } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { Flex, Box, useDisclosure, Link, HStack } from "@chakra-ui/react"
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"
import { TriangleDownIcon } from "@chakra-ui/icons"

import NavLink from "../ui/NavLink"
import ToggleMenu from "../ui/ToggleMenu"
import SocialLink from "../ui/SocialLink"
import LocalizedLink from "../ui/LocalizedLink"

import { EASINGS } from "../../theme/utils"
import Languages from "../ui/Languages"

import { FaFacebook } from "@react-icons/all-files/fa/FaFacebook"

const Header = () => {
  const menuItems = useMenu()
  const { social } = useSiteMetadata()
  const { home, menuTitle } = useTranslations()
  const { isOpen, onOpen, onClose } = useDisclosure()

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
      h={isOpen ? "auto" : "100px"}
      w="full"
      pos="fixed"
      top="0"
      right="0"
      left="0"
      zIndex="3"
      bg="paleGrey.500"
      color="dullBrown.500"
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

        <Flex
          display={{ base: "none", md: "inherit" }}
          align="center"
          direction="row"
          justify="space-between"
        >
          <Menu matchWidth={true} offset={0}>
            <MenuButton as={Link} variant="nav-link-lg">
              {menuTitle}
              <TriangleDownIcon pl={1} />
            </MenuButton>
            <MenuList>
              {menuItems.map((menu, index) => {
                return menu.variant !== "nav-sublink" ? (
                  <></>
                ) : (
                  <MenuItem>
                    <NavLink
                      key={index}
                      to={menu.link}
                      onClick={onClose}
                      variant="nav-link-lg"
                    >
                      {menu.name}
                    </NavLink>
                  </MenuItem>
                )
              })}
            </MenuList>
          </Menu>
          {menuItems.map((menu, index) => {
            return menu.variant === "nav-sublink" ? (
              <></>
            ) : (
              <NavLink
                key={index}
                to={menu.link}
                onClick={onClose}
                variant="nav-link-lg"
              >
                {menu.name}
              </NavLink>
            )
          })}
          <Languages />
        </Flex>

        <HStack spacing={2} display={{ base: "none", md: "inherit" }}>
          <SocialLink
            color="dullBrown.500"
            item={social.facebook}
            icon={FaFacebook}
          />
        </HStack>
      </Flex>
    </Box>
  )
}

export default Header
