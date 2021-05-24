import React from "react"
import { FormControl, Select } from "@chakra-ui/react"

import useTranslations from "../useTranslations"

const PlotTypeInput = ({ field, placeholderStyles }) => {
  const { plotType } = useTranslations()

  return (
    <FormControl isRequired>
      <Select
        {...field}
        id="tipusParcela"
        borderRadius={0}
        variant="filled"
        placeholder={plotType}
        _placeholder={placeholderStyles}
      >
        {["Standard", "XL"].map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </FormControl>
  )
}

export default PlotTypeInput
