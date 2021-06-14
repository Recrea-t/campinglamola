import React from "react"

import { Heading, Table, Tbody, Tr, Td } from "@chakra-ui/react"

import useTranslations from "../useTranslations"

import ReactMarkdown from "react-markdown"
import ChakraUIRenderer from "../../utils/ChakraUIRenderer"

const SeasonsPricingItem = ({ title, details, notes, size = "md" }) => {
  const getPrice = price =>
    Intl.NumberFormat(undefined, {
      currency: "EUR",
      minimumFractionDigits: 2,
      style: "currency",
    }).format(parseFloat(price ? price : 0))

  const { highSeason, lowSeason } = useTranslations()

  return (
    <>
      {title && (
        <Heading variant="in-box" mb={4} textTransform="uppercase">
          {title}
        </Heading>
      )}

      <Heading
        variant="in-markdown"
        size="md"
        textTransform="uppercase"
        w="full"
        textAlign="center"
      >
        {highSeason}
      </Heading>

      <Table colorScheme="dullBrown" size={size} mb={4}>
        <Tbody>
          {details.map((row, index) => (
            <Tr key={index}>
              <Td>{row.title}</Td>
              <Td isNumeric>{getPrice(row.highSeason)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Heading
        variant="in-markdown"
        size="md"
        textTransform="uppercase"
        w="full"
        textAlign="center"
      >
        {lowSeason}
      </Heading>

      <Table colorScheme="dullBrown" size={size} mb={4}>
        <Tbody>
          {details.map((row, index) => (
            <Tr key={index}>
              <Td>{row.title}</Td>
              <Td isNumeric>{getPrice(row.lowSeason)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <ReactMarkdown components={ChakraUIRenderer()} children={notes} />
    </>
  )
}

export default SeasonsPricingItem
