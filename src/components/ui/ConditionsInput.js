import React from "react"

import { FormControl, FormErrorMessage, Checkbox } from "@chakra-ui/react"

import LocalizedLink from "../ui/LocalizedLink"
import useTranslations from "../useTranslations"

const ConditionsInput = ({ field, form }) => {
  const { conditionsPart1, conditionsPart2, privacyPolicy } = useTranslations()
  return (
    <FormControl
      isRequired
      isInvalid={form.errors.condicions && form.touched.condicions}
    >
      <Checkbox
        {...field}
        id="condicions"
        size="sm"
        colorScheme="dullBrown"
        fontSize="xs"
      >
        {conditionsPart1}
        <LocalizedLink textTransform="uppercase" to="/proteccio-de-dades">
          {privacyPolicy}
        </LocalizedLink>
        {conditionsPart2}
      </Checkbox>
      <FormErrorMessage>{form.errors.condicions}</FormErrorMessage>
    </FormControl>
  )
}

export default ConditionsInput
