import React from "react"

import { Grid, GridItem, HStack } from "@chakra-ui/react"
import { MotionButton } from "../../theme/utils"
import { useToast } from "@chakra-ui/react"
import { Formik, Form, Field } from "formik"

import useTranslations from "../useTranslations"

import NameInput from "./NameInput"
import PhoneInput from "./PhoneInput"
import EmailInput from "./EmailInput"
import CountryInput from "./CountryInput"
import DatePickerInput from "./DatePickerInput"
import NumberAdultsInput from "./NumberAdultsInput"
import NumberChildrenInput from "./NumberChildrenInput"
import CommentsInput from "./CommentsInput"
import ConditionsInput from "./ConditionsInput"

const BungalowsForm = ({ name }) => {
  const toast = useToast()

  const encode = data => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&")
  }

  const placeholderStyles = {
    color: "darkIndigo.200",
  }

  const {
    startDate,
    endDate,
    submit,
    submitting,
    errorDates,
    errorConditions,
    messageSuccessfulTitle,
    messageSuccessfulDescription,
  } = useTranslations()

  return (
    <Formik
      initialValues={{
        nom: "",
        telefon: "",
        email: "",
        pais: "",
        dataArribada: null,
        dataSortida: null,
        numeroPersones: 0,
        comentaris: "",
        condicions: false,
      }}
      onSubmit={(values, actions) => {
        fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encode({
            "form-name": name,
            ...values,
            dataArribada: values.dataArribada.toLocaleDateString("ca-ES"),
            dataSortida: values.dataSortida.toLocaleDateString("ca-ES"),
          }),
        })
          .then(() => {
            actions.resetForm()
            toast({
              title: messageSuccessfulTitle,
              description: messageSuccessfulDescription,
              status: "success",
              duration: 9000,
              isClosable: true,
            })
          })
          .catch(error => alert(error))
          .finally(() => actions.setSubmitting(false))
      }}
      validate={values => {
        const errors = {}

        if (values.dataArribada && values.dataSortida) {
          if (new Date(values.dataArribada) >= new Date(values.dataSortida))
            errors.dataSortida = errorDates
        }
        if (!values.condicions) {
          errors.condicions = errorConditions
        }
        return errors
      }}
    >
      {props => (
        <Form name={name} data-netlify="true" data-netlify-honeypot="bot-field">
          <Field type="hidden" name="form-name" />
          <Field type="hidden" name="bot-field" />

          <Grid
            templateColumns={["repeat(1, 1fr)", null, "repeat(2, 1fr)"]}
            templateRows={["repeat(1, 1fr)", null, "repeat(5, min-content)"]}
            gap={4}
            mt={4}
          >
            <GridItem>
              <Field name="nom">
                {({ field, form }) => (
                  <NameInput
                    field={field}
                    placeholderStyles={placeholderStyles}
                  />
                )}
              </Field>
            </GridItem>

            <GridItem colStart={1}>
              <Field name="telefon">
                {({ field, form }) => (
                  <PhoneInput
                    field={field}
                    placeholderStyles={placeholderStyles}
                  />
                )}
              </Field>
            </GridItem>

            <GridItem colStart={1}>
              <Field name="email">
                {({ field, form }) => (
                  <EmailInput
                    field={field}
                    placeholderStyles={placeholderStyles}
                  />
                )}
              </Field>
            </GridItem>

            <GridItem colStart={1} rowStart={4}>
              <Field name="pais">
                {({ field, form }) => (
                  <CountryInput
                    field={field}
                    placeholderStyles={placeholderStyles}
                  />
                )}
              </Field>
            </GridItem>

            <GridItem colStart={[1, null, 2]} rowStart={[5, null, 1]}>
              <HStack spacing={4} alignItems="flex-start">
                <Field name="dataArribada">
                  {({ field, form }) => (
                    <DatePickerInput
                      id="dataArribada"
                      placeholder={startDate}
                      field={field}
                      form={form}
                      placeholderStyles={placeholderStyles}
                    />
                  )}
                </Field>
                <Field name="dataSortida">
                  {({ field, form }) => (
                    <DatePickerInput
                      id="dataSortida"
                      placeholder={endDate}
                      field={field}
                      form={form}
                      placeholderStyles={placeholderStyles}
                    />
                  )}
                </Field>
              </HStack>
            </GridItem>

            <GridItem colStart={[1, null, 2]} rowStart={[6, null, 1]}>
              <HStack spacing={4}>
                <Field name="numeroAdults">
                  {({ field, form }) => (
                    <NumberAdultsInput
                      field={field}
                      placeholderStyles={placeholderStyles}
                    />
                  )}
                </Field>
                <Field name="numeroNens">
                  {({ field, form }) => (
                    <NumberChildrenInput
                      field={field}
                      placeholderStyles={placeholderStyles}
                    />
                  )}
                </Field>
              </HStack>
            </GridItem>

            <GridItem
              rowSpan={3}
              colStart={[1, null, 2]}
              rowStart={[7, null, 3]}
            >
              <Field name="comentaris">
                {({ field, form }) => (
                  <CommentsInput
                    field={field}
                    placeholderStyles={placeholderStyles}
                  />
                )}
              </Field>
            </GridItem>

            <GridItem colStart={[1, null, 2]}>
              <Field name="condicions">
                {({ field, form }) => (
                  <ConditionsInput field={field} form={form} />
                )}
              </Field>
            </GridItem>

            <GridItem colStart={[1, null, 2]}>
              <MotionButton
                color="paleGrey.500"
                colorScheme="dullBrown"
                borderRadius={0}
                alignSelf="flex-start"
                type="submit"
                isLoading={props.isSubmitting}
                loadingText={submitting}
                whileTap={{ scale: 0.95 }}
              >
                {submit}
              </MotionButton>
            </GridItem>
          </Grid>
        </Form>
      )}
    </Formik>
  )
}

export default BungalowsForm
