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
} from "@chakra-ui/react"
import { HamburgerIcon, PhoneIcon, EmailIcon } from "@chakra-ui/icons"

import useTranslations from "../useTranslations"
import Languages from "../ui/Languages"

import useSiteMetadata from "../siteMetadata"

import { MotionLink, MotionText, EASINGS } from "../../theme/utils"

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
        placement="top"
        size="full"
        isFullheight={true}
      >
        <DrawerContent>
          <Center
            pos="relative"
            p={4}
            h="full"
            maxWidth="1200px"
            w="full"
            mx="auto"
          >
            <DrawerCloseButton />
            <DrawerBody>
              <MotionText
                fontWeight="semibold"
                fontSize="2rem"
                textTransform="uppercase"
                variants={{
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                  hidden: {
                    opacity: 0,
                    y: "-40vh",
                  },
                }}
                initial={"hidden"}
                animate={isOpen ? "visible" : "hidden"}
                transition={{
                  y: {
                    ease: [0.165, 0.84, 0.44, 1],
                    duration: 1.31,
                    delay: 0.23,
                  },
                  opacity: {
                    duration: 1.31,
                    ease: EASINGS.ease,
                    delay: 0.23,
                  },
                }}
              >
                {menuTitle}
              </MotionText>
              {children}
              <Center w="full" my={4}>
                <HStack spacing={[12, null, 16]}>
                  <MotionLink
                    href={`tel:${organization.phones[1].number}`}
                    title={callUs}
                    color="paleGrey.500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PhoneIcon h={12} w={12} />
                  </MotionLink>
                  <MotionLink
                    href={`mailto:${organization.email}`}
                    title={writeUs}
                    color="paleGrey.500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <EmailIcon h={14} w={14} />
                  </MotionLink>
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
