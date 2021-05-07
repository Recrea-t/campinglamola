import React from "react"
import propTypes from "prop-types"
import LocalizedLink from "./LocalizedLink"
import useTranslations from "../useTranslations"
import { HStack } from "@chakra-ui/react"

const Pagination = ({
  isFirst,
  isLast,
  currentPage,
  numPages,
  prevPage,
  nextPage,
}) => {
  const { next, prev, of } = useTranslations()

  return (
    <HStack py={4}>
      {!isFirst && <LocalizedLink to={prevPage}>← {prev}</LocalizedLink>}
      <p>
        {currentPage} {of} {numPages}
      </p>
      {!isLast && <LocalizedLink to={nextPage}>{next} →</LocalizedLink>}
    </HStack>
  )
}

Pagination.propTypes = {
  isFirst: propTypes.bool.isRequired,
  isLast: propTypes.bool.isRequired,
  currentPage: propTypes.number.isRequired,
  numPages: propTypes.number.isRequired,
  prevPage: propTypes.string,
  nextPage: propTypes.string,
}

export default Pagination
