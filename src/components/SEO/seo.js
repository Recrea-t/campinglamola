import React from "react"
import PropTypes from "prop-types"
import SchemaOrg from "./SchemaOrg"
import { Helmet } from "react-helmet"

import { useLocation } from "@reach/router"
import useSiteMetadata from "../siteMetadata"

import locales from "../../../data/i18n"
import { useLocale } from "../../hooks/locale"
import useLanguageMapping from "../useLanguageMapping"

const SEO = ({ title, description, image, isBlogPost, datePublished }) => {
  const { locale } = useLocale()
  const { pathname } = useLocation()
  const languageMapping = useLanguageMapping()

  const {
    titleTemplate,
    defaultImage,
    siteUrl,
    color,
    author,
    organization,
    social,
  } = useSiteMetadata()

  const { defaultTitle, defaultDescription, ogLanguage } = locales[locale]

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${pathname}`,
  }

  // Ruta sin prefijo de idioma ni barra final, como en data/language-mapping
  const prefix = `/${locale}/`
  const url = (
    !locales[locale].default && pathname.startsWith(prefix)
      ? pathname.slice(prefix.length - 1)
      : pathname
  ).replace(/(.)\/$/, "$1")
  const is404 = url === "/404"
  const associatedUrls = is404
    ? null
    : languageMapping.find(item => item[locale] && item[locale].link === url)

  // Las páginas se publican con barra final: sin ella, la URL hace 301
  const localizedUrl = (lang, link) => {
    const path = link === "/" ? "/" : `${link}/`
    return locales[lang].default
      ? `${siteUrl}${path}`
      : `${siteUrl}/${lang}${path}`
  }
  const defaultLang = Object.keys(locales).find(lang => locales[lang].default)

  return (
    <React.Fragment>
      <Helmet title={seo.title} titleTemplate={titleTemplate}>
        <html lang={locale} />
        <meta name="description" content={seo.description} />
        <meta name="image" content={seo.image} />
        <meta name="theme-color" content={color} />
        {is404 ? (
          <meta name="robots" content="noindex" />
        ) : (
          <link rel="canonical" href={seo.url} />
        )}
        {associatedUrls &&
          Object.keys(associatedUrls)
            .filter(lang => associatedUrls[lang])
            .map(lang => (
              <link
                rel="alternate"
                hreflang={locales[lang].locale}
                href={localizedUrl(lang, associatedUrls[lang].link)}
                key={lang}
              />
            ))}
        {associatedUrls && associatedUrls[defaultLang] && (
          <link
            rel="alternate"
            hreflang="x-default"
            href={localizedUrl(defaultLang, associatedUrls[defaultLang].link)}
          />
        )}

        {/* OpenGraph tags */}
        <meta property="og:url" content={seo.url} />
        {isBlogPost ? (
          <meta property="og:type" content="article" />
        ) : (
          <meta property="og:type" content="website" />
        )}
        {locale !== "en-US" ? (
          <meta property="og:locale" content={ogLanguage} />
        ) : null}
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={seo.image} />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content={social.twitter} />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={seo.image} />

        {/* Facebook tag */}
        {social.fbAppID && (
          <meta property="fb:app_id" content={social.fbAppID} />
        )}
      </Helmet>
      <SchemaOrg
        isBlogPost={isBlogPost}
        url={seo.url}
        title={seo.title}
        image={seo.image}
        description={seo.description}
        datePublished={datePublished}
        siteUrl={siteUrl}
        author={author}
        organization={organization}
        defaultTitle={defaultTitle}
      />
    </React.Fragment>
  )
}

SEO.defaultProps = {
  title: null,
  description: null,
  image: null,
  lang: `ca`,
  locale: `ca_ES`,
  isBlogPost: false,
  datePublished: null,
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  lang: PropTypes.string,
  locale: PropTypes.string,
  isBlogPost: PropTypes.bool,
  datePublished: PropTypes.instanceOf(Date),
}

export default SEO
