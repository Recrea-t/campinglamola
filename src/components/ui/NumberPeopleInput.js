import React from "react"
import { FormControl, Select } from "@chakra-ui/react"

import useTranslations from "../useTranslations"

const NumberPeopleInput = ({ field, placeholderStyles }) => {
  const { numberPeople } = useTranslations()

  return (
    <FormControl isRequired>
      <Select
        {...field}
        id="numeroPersones"
        borderRadius={0}
        variant="filled"
        placeholder={numberPeople}
        _placeholder={placeholderStyles}
      >
        {[4, 6].map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </FormControl>
  )
}

export default NumberPeopleInput
