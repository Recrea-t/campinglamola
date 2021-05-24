import React from "react"
import {
  Box,
  Icon,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@chakra-ui/react"
import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons"

const CustomAccordionItem = ({ title, content }) => (
  <AccordionItem mb={1}>
    {({ isExpanded }) => (
      <>
        <AccordionButton
          _expanded={{
            bg: "paleGrey.500",
            color: "dullBrown.500",
            _hover: {
              bg: "paleGrey.600",
            },
          }}
        >
          <Box as="h3" flex="1" textAlign="left">
            {title}
          </Box>
          {isExpanded ? (
            <Icon as={TriangleUpIcon} />
          ) : (
            <Icon as={TriangleDownIcon} />
          )}
        </AccordionButton>
        <AccordionPanel pb={1}>{content}</AccordionPanel>
      </>
    )}
  </AccordionItem>
)

export default CustomAccordionItem
