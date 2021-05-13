import React from "react"
import {
  Box,
  Text,
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  HStack,
  Center,
  Link,
} from "@chakra-ui/react"
import { HamburgerIcon, PhoneIcon, EmailIcon } from "@chakra-ui/icons"

import useTranslations from "../useTranslations"
import Languages from "../ui/Languages"

import useSiteMetadata from "../siteMetadata"

const ToggleMenu = props => {
  const { isOpen, onOpen, onClose, children } = props
  const btnRef = React.useRef()

  const { menuTitle, callUs, writeUs } = useTranslations()
  const { organization } = useSiteMetadata()

  return (
    <>
      <Box onClick={onOpen} ref={btnRef}>
        <HamburgerIcon w={8} h={8} color="dullBrown.500" />
      </Box>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        finalFocusRef={btnRef}
        size="full"
        isFullheight={true}
        motionPreset="scale"
      >
        <DrawerContent>
          <Center pos="relative" p={4} h="full">
            <DrawerCloseButton />
            <DrawerBody>
              <Text
                fontWeight="semibold"
                fontSize="2rem"
                textTransform="uppercase"
              >
                {menuTitle}
              </Text>
              {children}
              <Center w="full" my={4}>
                <HStack spacing={[12, null, 16]}>
                  <Link
                    href={`tel:${organization.phones[1].number}`}
                    title={callUs}
                    color="paleGrey.500"
                  >
                    <PhoneIcon h={12} w={12} />
                  </Link>
                  <Link
                    href={`mailto:${organization.email}`}
                    title={writeUs}
                    color="paleGrey.500"
                  >
                    <EmailIcon h={14} w={14} />
                  </Link>
                </HStack>
              </Center>
              <Languages />
            </DrawerBody>
          </Center>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default ToggleMenu
