import React from "react"
import { FormControl, Select } from "@chakra-ui/react"

import useTranslations from "../useTranslations"

const NumberAdultsInput = ({ field, placeholderStyles }) => {
  const { numberAdults } = useTranslations()

  return (
    <FormControl isRequired>
      <Select
        {...field}
        id="numeroAdults"
        borderRadius={0}
        variant="filled"
        placeholder={numberAdults}
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

export default NumberAdultsInput
