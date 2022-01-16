import React, { useEffect } from "react"
import { Link as GatsbyLink } from "gatsby"
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
  Image,
} from "@chakra-ui/react"

import logo from "../../images/Logo.svg"

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
        size="full"
        blockScrollOnMount
      >
        <ModalOverlay />
        <ModalContent bg="paleGrey.500" borderRadius={0}>
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
            <Box textAlign="center">
              <ReactMarkdown
                components={ChakraUIRenderer()}
                children={description}
              />
            </Box>
          </ModalBody>

          <ModalFooter>
            <HStack w="full" justify="space-between">
              <Image src={logo} alt="Recrea't" w={["50%", null, "200px"]} />
              <MotionLink
                as={GatsbyLink}
                to="/contacte"
                title={moreButton}
                variant="button"
                colorScheme="dullBrown"
                fontSize={["xs", null, "md"]}
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
