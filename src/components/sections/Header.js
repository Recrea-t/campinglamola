import React from "react"
import useMenu from "../useMenu"
import useTranslations from "../useTranslations"

import { Link as GatsbyLink } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { Flex, Box } from "@chakra-ui/react"

import NavLink from "../ui/NavLink"
import ToggleMenu from "../ui/ToggleMenu"
import Languages from "../ui/Languages"
import LocalizedLink from "../ui/LocalizedLink"

const Header = () => {
  const menuItems = useMenu()
  const { home } = useTranslations()
  const [show, setShow] = React.useState(false)
  const toggleMenu = () => setShow(!show)

  return (
    <Box
      as="nav"
      w="full"
      h={show ? "auto" : "100px"}
      pos="fixed"
      top="0"
      right="0"
      left="0"
      zIndex="1"
      bg="white"
      color="mangoTango.500"
      borderBottom="1px"
      borderBottomColor="mangoTango.500"
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
            src="../../images/LogoRecreat.png"
            alt="Recrea't"
            loading="eager"
            layout="fixed"
            placeholder="tracedSVG"
            width={200}
          />
        </LocalizedLink>

        <ToggleMenu show={show} toggleMenu={toggleMenu}>
          {menuItems.map((menu, index) => (
            <NavLink key={index} to={menu.link} onClick={toggleMenu}>
              {menu.name}
            </NavLink>
          ))}
          <Languages />
        </ToggleMenu>

        <Flex
          display={{ base: "none", md: "inherit" }}
          align="center"
          direction="row"
          justify={{ md: "space-between", lg: "flex-end" }}
        >
          {menuItems.map((menu, index) => (
            <NavLink key={index} to={menu.link}>
              {menu.name}
            </NavLink>
          ))}
          <Languages />
        </Flex>
      </Flex>
    </Box>
  )
}

export default Header
