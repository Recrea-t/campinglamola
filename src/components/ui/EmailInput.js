import React from "react"
import { FormControl, Input } from "@chakra-ui/react"
import useTranslations from "../useTranslations"

const EmailInput = ({ field, placeholderStyles }) => {
  const { email } = useTranslations()

  return (
    <FormControl isRequired>
      <Input
        {...field}
        id="email"
        type="email"
        borderRadius={0}
        variant="filled"
        placeholder={email}
        _placeholder={placeholderStyles}
      />
    </FormControl>
  )
}
export default EmailInput
