import React from "react"
import { FormControl, Textarea } from "@chakra-ui/react"
import useTranslations from "../useTranslations"

const MessageInput = ({ field, placeholderStyles }) => {
  const { comments } = useTranslations()

  return (
    <FormControl>
      <Textarea
        {...field}
        id="comentaris"
        borderRadius={0}
        variant="filled"
        placeholder={comments}
        _placeholder={placeholderStyles}
        h={40}
        resize="none"
      />
    </FormControl>
  )
}

export default MessageInput
