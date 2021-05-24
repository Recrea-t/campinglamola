import React from "react"

import { Grid, GridItem } from "@chakra-ui/react"
import { MotionButton } from "../../theme/utils"
import { useToast } from "@chakra-ui/react"
import { Formik, Form, Field } from "formik"

import useTranslations from "../useTranslations"

import NameInput from "./NameInput"
import EmailInput from "./EmailInput"
import MessageInput from "./MessageInput"
import ConditionsInput from "./ConditionsInput"

const ContactForm = () => {
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
    submit,
    submitting,
    errorConditions,
    messageSuccessfulTitle,
    messageSuccessfulDescription,
  } = useTranslations()

  return (
    <Formik
      initialValues={{
        nom: "",
        email: "",
        missatge: "",
        condicions: false,
      }}
      onSubmit={(values, actions) => {
        fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encode({
            "form-name": "contacte-web",
            ...values,
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
        if (!values.condicions) {
          errors.condicions = errorConditions
        }
        return errors
      }}
    >
      {props => (
        <Form
          name="contacte-web"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
        >
          <Field type="hidden" name="form-name" />
          <Field type="hidden" name="bot-field" />

          <Grid
            templateColumns={["repeat(1, 1fr)", null, "repeat(2, 1fr)"]}
            templateRows={["repeat(1, 1fr)", null, "repeat(4, min-content)"]}
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
              <Field name="email">
                {({ field, form }) => (
                  <EmailInput
                    field={field}
                    placeholderStyles={placeholderStyles}
                  />
                )}
              </Field>
            </GridItem>

            <GridItem
              rowSpan={3}
              colStart={[1, null, 2]}
              rowStart={[3, null, 1]}
            >
              <Field name="missatge">
                {({ field, form }) => (
                  <MessageInput
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

export default ContactForm
