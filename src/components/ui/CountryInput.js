import React, { useMemo } from "react"
import { FormControl, Select } from "@chakra-ui/react"

import countryList from "react-select-country-list"

import useTranslations from "../useTranslations"

const CountryInput = ({ field, placeholderStyles }) => {
  const { country } = useTranslations()

  const options = useMemo(() => countryList().getData(), [])

  return (
    <FormControl>
      <Select
        {...field}
        id="pais"
        borderRadius={0}
        variant="filled"
        placeholder={country}
        _placeholder={placeholderStyles}
      >
        {options.map((option, index) => (
          <option key={index} value={option.label}>
            {option.label}
          </option>
        ))}
      </Select>
    </FormControl>
  )
}

export default CountryInput
