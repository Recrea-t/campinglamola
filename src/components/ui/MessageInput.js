import React from "react"
import { FormControl, Textarea } from "@chakra-ui/react"
import useTranslations from "../useTranslations"

const MessageInput = ({ field, placeholderStyles }) => {
  const { message } = useTranslations()

  return (
    <FormControl isRequired>
      <Textarea
        {...field}
        id="missatge"
        borderRadius={0}
        variant="filled"
        placeholder={message}
        _placeholder={placeholderStyles}
        h={40}
        resize="none"
      />
    </FormControl>
  )
}

export default MessageInput
