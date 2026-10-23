import React from "react";
import { Helmet } from "react-helmet";

export default React.memo(
  ({
    amenities,
    author,
    siteUrl,
    datePublished,
    defaultTitle,
    defaultDescription,
    description,
    image,
    isBlogPost,
    lang,
    organization,
    petsAllowed,
    social,
    title,
    url,
  }) => {
    // El camping entero. La landing del área de autocaravanas enlaza aquí con
    // containedInPlace (landing-area/build.py), así que este @id no debe cambiar.
    const campingId = `${siteUrl}/#camping`;

    const baseSchema = [
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            url: `${siteUrl}/`,
            name: organization.name,
            inLanguage: lang,
            publisher: { "@id": campingId },
          },
          {
            "@type": ["Campground", "LodgingBusiness", "LocalBusiness"],
            "@id": campingId,
            name: organization.name,
            url: `${siteUrl}/`,
            description: defaultDescription,
            email: organization.email,
            telephone: organization.phones[0].number,
            contactPoint: organization.phones.map(phone => ({
              "@type": "ContactPoint",
              telephone: phone.number,
              contactType: "customer service",
            })),
            logo: `${siteUrl}${organization.logo}`,
            address: { "@type": "PostalAddress", ...organization.postalAddress },
            geo: { "@type": "GeoCoordinates", ...organization.geo },
            hasMap: organization.hasMap,
            amenityFeature: amenities.map(name => ({
              "@type": "LocationFeatureSpecification",
              name,
              value: true,
            })),
            petsAllowed,
            sameAs: [
              `${social.facebook.baseUrl}${social.facebook.username}`,
            ],
          },
        ],
      },
    ];

    const schema = isBlogPost
      ? [
          ...baseSchema,
          {
            "@context": "http://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                item: {
                  "@id": url,
                  name: title,
                  image,
                },
              },
            ],
          },
          {
            "@context": "http://schema.org",
            "@type": "BlogPosting",
            url,
            name: title,
            alternateName: defaultTitle,
            headline: title,
            image: {
              "@type": "ImageObject",
              url: image,
            },
            description,
            author: {
              "@type": "Person",
              name: author.name,
            },
            publisher: {
              "@type": "Organization",
              url: organization.url,
              logo: {
                "@type": "ImageObject",
                url: organization.logo,
              },
              name: organization.name,
            },
            mainEntityOfPage: {
              "@type": "WebSite",
              "@id": siteUrl,
            },
            datePublished,
          },
        ]
      : baseSchema;

    return (
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
    );
  }
);
