import React from "react"
import { FormControl, Input } from "@chakra-ui/react"
import useTranslations from "../useTranslations"

const EmailInput = ({ field, placeholderStyles }) => {
  const { phone } = useTranslations()

  return (
    <FormControl>
      <Input
        {...field}
        id="telefon"
        type="tel"
        borderRadius={0}
        variant="filled"
        placeholder={phone}
        _placeholder={placeholderStyles}
      />
    </FormControl>
  )
}
export default EmailInput
