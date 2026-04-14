import React from "react"
import { graphql, withPrefix } from "gatsby"
import { Helmet } from "react-helmet"
import "../styles/styles.css"

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  return (
    <div className="blog-post-container">
      <Helmet>
        <script src={withPrefix('js/review_api.js')}  type="text/javascript" ></script>
      </Helmet>

      <div className="blog-post">
        <h1>{frontmatter.title}</h1>
        <h2>Built at: {frontmatter.date}</h2>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "YYYY-MM-DD HH:MM:SS")
        slug
        title
      }
    }
  }
`
