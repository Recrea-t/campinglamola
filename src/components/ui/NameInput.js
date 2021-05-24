import React from "react"
import { FormControl, Input } from "@chakra-ui/react"
import useTranslations from "../useTranslations"

const NameInput = ({ field, placeholderStyles }) => {
  const { name } = useTranslations()

  return (
    <FormControl isRequired>
      <Input
        {...field}
        id="nom"
        type="text"
        borderRadius={0}
        variant="filled"
        placeholder={name}
        _placeholder={placeholderStyles}
      />
    </FormControl>
  )
}

export default NameInput
