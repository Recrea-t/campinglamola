import React from "react"
import { graphql } from "gatsby"
import { Container, SimpleGrid } from "@chakra-ui/react"

import SEO from "../components/SEO/seo"
import PostCard from "../components/ui/PostCard"
import Pagination from "../components/ui/Pagination"

const Blog = props => {
  const postList = props.data.allMarkdownRemark.edges

  // Logic for Pagination Component
  const { currentPage, numPages } = props.pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = currentPage - 1 === 1 ? "/blog" : `/blog/${currentPage - 1}`
  const nextPage = `/blog/page/${currentPage + 1}`

  return (
    <>
      <SEO title="Blog" description="" />
      <Container my={8}>
        <SimpleGrid minChildWidth="320px" spacing={8}>
          {postList.map(
            ({
              node: {
                frontmatter: {
                  category,
                  tags,
                  date,
                  description,
                  title,
                  image,
                },
                timeToRead,
                fields: { slug },
              },
            }) => (
              <PostCard
                slug={`/blog/${slug}`}
                category={category}
                tags={tags}
                date={date}
                timeToRead={timeToRead}
                title={title}
                description={description}
                image={image}
                key={slug}
              />
            )
          )}
        </SimpleGrid>

        <Pagination
          isFirst={isFirst}
          isLast={isLast}
          currentPage={currentPage}
          numPages={numPages}
          prevPage={prevPage}
          nextPage={nextPage}
        />
      </Container>
    </>
  )
}

export const query = graphql`
  query PostsList(
    $locale: String!
    $dateFormat: String!
    $skip: Int!
    $limit: Int!
  ) {
    allMarkdownRemark(
      sort: { fields: frontmatter___date, order: DESC }
      filter: {
        frontmatter: { templateKey: { eq: "post-page" } }
        fields: { locale: { eq: $locale } }
      }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          frontmatter {
            title
            description
            category
            tags
            date(formatString: $dateFormat)
            image {
              childImageSharp {
                gatsbyImageData(
                  width: 600
                  height: 350
                  placeholder: TRACED_SVG
                )
              }
            }
          }
          timeToRead
          fields {
            slug
            locale
          }
        }
      }
    }
  }
`

export default Blog
