import React from "react"
import {
  Box,
  Flex,
  HStack,
  Text,
  Divider,
  StackDivider,
  Wrap,
  WrapItem,
  Link,
  VStack,
} from "@chakra-ui/react"
import { StaticImage } from "gatsby-plugin-image"

import LocalizedLink from "../ui/LocalizedLink"
import useTranslations from "../useTranslations"

import useSiteMetadata from "../siteMetadata"

const Footer = props => {
  const { organization, author } = useSiteMetadata()
  const { callUs, writeUs, legalNote, privacyPolicy } = useTranslations()
  return (
    <Box
      as="footer"
      w="full"
      borderColor="darkIndigo.500"
      borderTop="1px"
      {...props}
    >
      <Flex direction="column" w="full" align="center" justify="center">
        <Wrap
          w="full"
          maxW="1200px"
          mx="auto"
          p={4}
          spacing={[2, null, 8]}
          justify="space-between"
        >
          <WrapItem>
            <Link
              href="https://www.acsi.eu/"
              title="ACSI"
              target="_blank"
              rel="noopener"
            >
              <StaticImage
                src="../../images/logosExterns/acsi-logo.jpg"
                alt="ACSI logo"
                height={64}
              />
            </Link>
          </WrapItem>
          <WrapItem>
            <Link
              href="https://www.anwb.nl/"
              title="anwb"
              target="_blank"
              rel="noopener"
            >
              <StaticImage
                src="../../images/logosExterns/anwb.jpg"
                alt="ANWB logo"
                height={64}
              />
            </Link>
          </WrapItem>
          <WrapItem>
            <Link
              href="https://bikeandrun.campingsdelleida.com/"
              title="Camping Bike&Run"
              target="_blank"
              rel="noopener"
            >
              <StaticImage
                src="../../images/logosExterns/campingbikeandrun.jpg"
                alt="Camping Bike&Run logo"
                height={64}
              />
            </Link>
          </WrapItem>
          <WrapItem>
            <Link
              href="http://act.gencat.cat/dtf/"
              title="Turisme Familiar"
              target="_blank"
              rel="noopener"
            >
              <StaticImage
                src="../../images/logosExterns/cat55_familiar.jpg"
                alt="Turisme Familiar logo"
                height={64}
              />
            </Link>
          </WrapItem>
          <WrapItem>
            <Link
              href="https://www.campingsdelleida.com/"
              title="Càmpings de Lleida"
              target="_blank"
              rel="noopener"
            >
              <StaticImage
                src="../../images/logosExterns/logotipo-campings-de-lleida.png"
                alt="Càmpings de Lleida logo"
                height={64}
              />
            </Link>
          </WrapItem>
          <WrapItem>
            <Link
              href="https://www.zoover.com/"
              title="Zoover"
              target="_blank"
              rel="noopener"
            >
              <StaticImage
                src="../../images/logosExterns/zoover.jpg"
                alt="Zoover logo"
                height={64}
              />
            </Link>
          </WrapItem>
        </Wrap>
        <Box bg="darkIndigo.500" w="full" color="paleGrey.500">
          <Flex
            w="full"
            maxW="1200px"
            mx="auto"
            p={4}
            direction={["column", null, null, "row"]}
            justify="space-evenly"
            align="center"
            textAlign="center"
          >
            <Text
              mb={[8, null, null, 0]}
              minW="250px"
              dangerouslySetInnerHTML={{ __html: organization.address }}
            />
            <VStack spacing={1} mb={[8, null, null, 0]}>
              <HStack w="full" justify="center" spacing={1}>
                {organization.phones.map((phone, index) => (
                  <>
                    <Text key="prefix">{index === 0 ? "(+34)" : ""}</Text>
                    <Link
                      key={index}
                      href={`tel:${phone.number}`}
                      title={callUs}
                      variant="in-footer-dark"
                    >
                      {phone.title}
                    </Link>
                    <Text key="space">{index === 0 ? "/" : ""}</Text>
                  </>
                ))}
              </HStack>
              <Text>
                <Link
                  href={`mailto:${organization.email}`}
                  title={writeUs}
                  variant="in-footer-dark"
                >
                  {organization.email}
                </Link>
              </Text>
            </VStack>
            <Text>
              Latitud: 42.56893 - Longitud: 1.11117
              <br />
              Registre nº KL-000011
            </Text>
          </Flex>
        </Box>
        <Flex
          w="full"
          maxW="1200px"
          mx="auto"
          p={4}
          direction={["column", null, "row"]}
          justify="center"
          textAlign="center"
        >
          <Text>
            {props.title} {new Date().getFullYear()}
          </Text>
          <Divider
            display={["none", null, "inherit"]}
            m={1}
            h={4}
            orientation="vertical"
            borderColor="darkIndigo.500"
          />
          <LocalizedLink
            to="/avis-legal"
            display={["none", null, "inherit"]}
            variant="in-footer-light"
          >
            {legalNote}
          </LocalizedLink>
          <Divider
            display={["none", null, "inherit"]}
            m={1}
            h={4}
            orientation="vertical"
            borderColor="darkIndigo.500"
          />
          <LocalizedLink
            to="/proteccio-de-dades"
            display={["none", null, "inherit"]}
            variant="in-footer-light"
          >
            {privacyPolicy}
          </LocalizedLink>
          <Divider
            display={["none", null, "inherit"]}
            m={1}
            h={4}
            orientation="vertical"
            borderColor="darkIndigo.500"
          />
          <HStack
            display={["inherit", null, "none"]}
            w="full"
            spacing={2}
            justify="center"
            divider={<StackDivider my=".25rem !important" />}
          >
            <LocalizedLink to="/avis-legal" variant="in-footer-light">
              {legalNote}
            </LocalizedLink>
            <LocalizedLink to="/proteccio-de-dades" variant="in-footer-light">
              {privacyPolicy}
            </LocalizedLink>
          </HStack>
          <Text>
            DISSENY:{" "}
            <Link
              href={author.url}
              title={author.description}
              isExternal
              target="_blank"
              rel="noopener"
              variant="in-footer-light"
            >
              {author.name}
            </Link>
          </Text>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Footer
