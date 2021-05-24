import React from "react"
import { FormControl, Select } from "@chakra-ui/react"

import useTranslations from "../useTranslations"

const NumberChildrenInput = ({ field, placeholderStyles }) => {
  const { numberChildren } = useTranslations()

  return (
    <FormControl>
      <Select
        {...field}
        id="numeroNens"
        borderRadius={0}
        variant="filled"
        placeholder={numberChildren}
        _placeholder={placeholderStyles}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </FormControl>
  )
}

export default NumberChildrenInput
