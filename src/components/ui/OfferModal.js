import React from "react"
import { Link as GatsbyLink } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import {
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
  return (
    <>
      <Button
        ref={finalRef}
        position="fixed"
        right={0}
        top="50vh"
        variant="solid"
        colorScheme="dullBrown"
        onClick={onOpen}
      >
        {offer}
      </Button>

      <Modal
        inalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bg="paleGrey.500">
          <ModalHeader>{offer}</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center">
            <Heading mb={4}>{title}</Heading>
            <Heading mb={4}>{subtitle}</Heading>
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
                whileHover={{ scale: 1.05 }}
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
