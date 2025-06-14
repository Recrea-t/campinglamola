import { useStaticQuery, graphql } from "gatsby"
import { useLocale } from "../hooks/locale"

function useTranslations() {
  // Grab the locale (passed through context) from the Locale Provider
  // through useLocale() hook
  const { locale } = useLocale()
  // Query the JSON files in <rootDir>/i18n/translations
  const { rawData } = useStaticQuery(query)

  // Simplify the response from GraphQL
  const simplified = rawData.edges.map(item => {
    return {
      name: item.node.name,
      translations: item.node.translations,
    }
  })

  // Only return translations for the current locale
  const { translations } = simplified.filter(lang => lang.name === locale)[0]

  return translations
}

export default useTranslations

const query = graphql`
  query useTranslations {
    rawData: allFile(filter: { sourceInstanceName: { eq: "translations" } }) {
      edges {
        node {
          name
          translations: childTranslationsJson {
            home
            menuTitle
            plots
            gaials
            bungalows
            parcNacional
            parcNatural
            aneu
            services
            environment
            summary
            pricing
            highSeason
            lowSeason
            regulation
            conditions
            offer

            next
            prev
            of

            moreButton

            callUs
            writeUs
	    
	    bookings
            reservations
            name
            email
            phone
            country
            startDate
            endDate
            numberPeople
            numberAdults
            numberChildren
            plotType
            powerSupply
            yes
            no
            comments
            message
            conditionsPart1
            conditionsPart2

            followUs
            legalNote
            privacyPolicy

            submit
            submitting
            errorDates
            errorConditions
            messageSuccessfulTitle
            messageSuccessfulDescription
          }
        }
      }
    }
  }
`
