import React, { useEffect } from "react"
import { Link as GatsbyLink } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  HStack,
  Heading,
  Button,
} from "@chakra-ui/react"

import { MotionLink } from "../../theme/utils"

import ReactMarkdown from "react-markdown"
import ChakraUIRenderer from "../../utils/ChakraUIRenderer"

import useTranslations from "../useTranslations"

const OfferModal = ({ title, subtitle, description }) => {
  const finalRef = React.useRef()
  const { offer, moreButton } = useTranslations()
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    onOpen()
  }, [])

  return (
    <>
      <Button
        ref={finalRef}
        position="fixed"
        right={0}
        top="50vh"
        w=".5rem"
        h="5rem"
        variant="solid"
        colorScheme="dullBrown"
        borderTopRightRadius={0}
        borderBottomRightRadius={0}
        onClick={onOpen}
        _focus={{ outline: "none" }}
      ></Button>

      <Modal
        inalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bg="paleGrey.500">
          <ModalHeader
            color="white"
            textTransform="uppercase"
            alignSelf="center"
            py={12}
          >
            <Box
              bg="#00ab59"
              borderRadius="lg"
              textAlign="center"
              w="fit-content"
              p={2}
              fontSize="7xl"
              fontWeight="extrabold"
              shadow="5px 5px #1a75cf"
              transform="rotate(-10deg)"
            >
              {offer}
            </Box>
          </ModalHeader>
          <ModalCloseButton _focus={{ outline: "none" }} />
          <ModalBody>
            <Heading
              mb={4}
              color="#00ab59"
              fontWeight="extrabold"
              textTransform="uppercase"
              textAlign="center"
            >
              {title}
            </Heading>
            <Heading
              mb={4}
              size="3xl"
              color="#00ab59"
              fontWeight="extrabold"
              textAlign="center"
              textShadow="3px 3px #1a75cf"
            >
              {subtitle}
            </Heading>
            <ReactMarkdown
              components={ChakraUIRenderer()}
              children={description}
            />
          </ModalBody>

          <ModalFooter>
            <HStack w="full" justify="space-between">
              <StaticImage
                src="../../images/Logo.svg"
                alt="Recrea't"
                loading="eager"
                layout="fixed"
                placeholder="tracedSVG"
                width={200}
              />
              <MotionLink
                as={GatsbyLink}
                to="/contacte"
                title={moreButton}
                variant="button"
                colorScheme="dullBrown"
                alignSelf="flex-end"
                textTransform="uppercase"
                py={2}
                whileTap={{ scale: 0.95 }}
              >
                {moreButton}
              </MotionLink>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default OfferModal
