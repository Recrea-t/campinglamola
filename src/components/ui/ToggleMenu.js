import React from "react"
import {
  IconButton,
  Box,
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Center,
} from "@chakra-ui/react"

import HamburgerIcon from "../../images/HamburgerIcon.svg"
import CloseIcon from "../../images/CloseIcon.svg"

import useTranslations from "../useTranslations"
import Languages from "../ui/Languages"

import { MotionIconButton, MotionText, EASINGS } from "../../theme/utils"

const ToggleMenu = props => {
  const { isOpen, onOpen, onClose, children, controls } = props
  const btnRef = React.useRef()

  const { menuTitle } = useTranslations()

  const toggleVariants = {
    visible: {
      background: "transparent",
      _focus: {
        outline: "none",
        bg: "transparent",
      },
      _active: {
        bg: "transparent",
      },
      _hover: {
        bg: "transparent",
      },
    },
    hidden: {
      background: "#ecf9f6",
      _focus: {
        outline: "none",
        bg: "paleGrey.500",
      },
      _active: {
        bg: "paleGrey.500",
      },
      _hover: {
        bg: "paleGrey.500",
      },
    },
  }

  return (
    <>
      <Box
        display={{ base: "block", md: "none" }}
        onClick={onOpen}
        ref={btnRef}
      >
        <MotionIconButton
          animate={controls}
          variants={toggleVariants}
          initial="visible"
          colorScheme="paleGrey"
          icon={<img src={HamburgerIcon} alt="Toggle navigation" />}
          _focus={{
            outline: "none",
            bg: "paleGrey.500",
          }}
          _active={{
            bg: "paleGrey.500",
          }}
          _hover={{
            bg: "paleGrey.500",
          }}
        />
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
            mb={[4, null, 0]}
          >
            <DrawerCloseButton
              _focus={{
                outline: "none",
                bg: "transparent",
              }}
              _active={{
                bg: "transparent",
              }}
            >
              <IconButton
                colorScheme="dullBrown"
                icon={<img src={CloseIcon} alt="Toggle navigation" />}
                _focus={{
                  outline: "none",
                  bg: "dullBrown.500",
                }}
                _hover={{
                  bg: "dullBrown.500",
                }}
                _active={{
                  bg: "dullBrown.500",
                }}
              />
            </DrawerCloseButton>

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

              <Languages />
            </DrawerBody>
          </Center>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default ToggleMenu
