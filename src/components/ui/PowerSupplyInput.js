import React from "react"
import { FormControl, Select } from "@chakra-ui/react"

import useTranslations from "../useTranslations"

const PowerSupplyInput = ({ field, placeholderStyles }) => {
  const { powerSupply, yes, no } = useTranslations()

  return (
    <FormControl isRequired>
      <Select
        {...field}
        id="electricitat"
        borderRadius={0}
        variant="filled"
        placeholder={powerSupply}
        _placeholder={placeholderStyles}
      >
        {[yes, no].map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </FormControl>
  )
}

export default PowerSupplyInput
