import React from "react"

import { useFormikContext } from "formik"

import ReactDatePicker, {
  registerLocale,
  setDefaultLocale,
} from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css"

import { useLocale } from "../../hooks/locale"
import locales from "../../../data/i18n"

import { FormControl, FormErrorMessage } from "@chakra-ui/react"

import ca from "date-fns/locale/ca"
import es from "date-fns/locale/es"
import en from "date-fns/locale/en-GB"
import fr from "date-fns/locale/fr"
import nl from "date-fns/locale/nl"

setDefaultLocale("ca-ES", ca)
registerLocale("ca-ES", ca)
registerLocale("es-ES", es)
registerLocale("en-GB", en)
registerLocale("fr-FR", fr)
registerLocale("nl-NL", nl)

const DatePicker = ({
  isClearable = false,
  showPopperArrow = false,
  ...props
}) => {
  const locale = locales[useLocale().locale]

  return (
    <ReactDatePicker
      dateFormat={locale.dateFormat}
      locale={locale.locale}
      isClearable={isClearable}
      showPopperArrow={showPopperArrow}
      minDate={new Date()}
      {...props}
    />
  )
}

const DatePickerInput = ({
  id,
  placeholder,
  field,
  form,
  placeholderStyles,
}) => {
  const { setFieldValue } = useFormikContext()

  return (
    <FormControl isRequired isInvalid={form.errors[id] && form.touched[id]}>
      <DatePicker
        {...field}
        id={id}
        borderRadius={0}
        variant="filled"
        placeholderText={placeholder}
        style={{
          _placeholder: placeholderStyles,
        }}
        showPopperArrow={true}
        selected={(field.value && new Date(field.value)) || null}
        onChange={val => {
          setFieldValue(field.name, val)
        }}
      />
      <FormErrorMessage>{form.errors[id]}</FormErrorMessage>
    </FormControl>
  )
}

export default DatePickerInput
