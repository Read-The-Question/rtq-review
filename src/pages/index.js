import * as React from "react"
import { Link, graphql } from 'gatsby'

// styles
const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
}
// const headingAccentStyles = {
//   color: "#663399",
// }
// const paragraphStyles = {
//   marginBottom: 48,
// }
// const codeStyles = {
//   color: "#8A6534",
//   padding: 4,
//   backgroundColor: "#FFF4DB",
//   fontSize: "1.25rem",
//   borderRadius: 4,
// }
const listStyles = {
  marginBottom: 96,
  paddingLeft: 0,
  listStyle: "decimal"

}
const listItemStyles = {
  fontWeight: 300,
  fontSize: 24,
  maxWidth: 560,
  marginBottom: 15,
}

const linkStyle = {
  color: "#8954A8",
  fontWeight: "bold",
  fontSize: 16,
  verticalAlign: "5%",
}

// const docLinkStyle = {
//   ...linkStyle,
//   listStyleType: "none",
//   marginBottom: 24,
// }

// const descriptionStyle = {
//   color: "#232129",
//   fontSize: 14,
//   marginTop: 10,
//   marginBottom: 0,
//   lineHeight: 1.25,
// }

// const docLink = {
//   text: "Documentation",
//   url: "https://www.gatsbyjs.com/docs/",
//   color: "#8954A8",
// }

// const badgeStyle = {
//   color: "#fff",
//   backgroundColor: "#088413",
//   border: "1px solid #088413",
//   fontSize: 11,
//   fontWeight: "bold",
//   letterSpacing: 1,
//   borderRadius: 4,
//   padding: "4px 6px",
//   display: "inline-block",
//   position: "relative",
//   top: -2,
//   marginLeft: 10,
//   lineHeight: 1,
// }

// data
// const links = [
//   {
//     text: "Tutorial",
//     url: "https://www.gatsbyjs.com/docs/tutorial/",
//     description:
//       "A great place to get started if you're new to web development. Designed to guide you through setting up your first Gatsby site.",
//     color: "#E95800",
//   },
//   {
//     text: "How to Guides",
//     url: "https://www.gatsbyjs.com/docs/how-to/",
//     description:
//       "Practical step-by-step guides to help you achieve a specific goal. Most useful when you're trying to get something done.",
//     color: "#1099A8",
//   },
//   {
//     text: "Reference Guides",
//     url: "https://www.gatsbyjs.com/docs/reference/",
//     description:
//       "Nitty-gritty technical descriptions of how Gatsby works. Most useful when you need detailed information about Gatsby's APIs.",
//     color: "#BC027F",
//   },
//   {
//     text: "Conceptual Guides",
//     url: "https://www.gatsbyjs.com/docs/conceptual/",
//     description:
//       "Big-picture explanations of higher-level Gatsby concepts. Most useful for building understanding of a particular topic.",
//     color: "#0D96F2",
//   },
//   {
//     text: "Plugin Library",
//     url: "https://www.gatsbyjs.com/plugins",
//     description:
//       "Add functionality and customize your Gatsby site or app with thousands of plugins built by our amazing developer community.",
//     color: "#8EB814",
//   },
//   {
//     text: "Build and Host",
//     url: "https://www.gatsbyjs.com/cloud",
//     badge: true,
//     description:
//       "Now you’re ready to show the world! Give your Gatsby site superpowers: Build and host on Gatsby Cloud. Get started for free!",
//     color: "#663399",
//   },
// ]

// markup
const IndexPage = ({data}) => {
  const prccNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      console.log(slug);
      return slug.startsWith("ragpapers") && 
      (
        slug.includes("-prcc") || 
        (slug.includes("-prns"))
      );
    });
  }

  const prpcrNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      console.log(slug);
      return slug.startsWith("ragpapers") && 
      (
        slug.includes("-prpcr")
      );
    });
  }

  const prcrNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      console.log(slug);
      return slug.startsWith("ragpapers") && 
      (
        slug.includes("-prcr")
      );
    });
  }

  const blockedNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      return slug.startsWith("ragpapers") && slug.includes("-blocked");
    });
  }

  const notstartedNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      return slug.startsWith("ragpapers") && slug.includes("-notstarted");
    });
  }


  const restOfNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;

      return slug.startsWith("ragpapers") && 
      !(
        (slug.includes("-blocked")) || 
        (slug.includes("-notstarted")) || 
        (slug.includes("-prcc")) || 
        (slug.includes("-prcr")) || 
        (slug.includes("-prpcr")) ||
        (slug.includes("-prns"))
        );
    });
  }

  return (
    <main style={pageStyles}>
      <title>Home Page</title>
      <h1 style={headingStyles}>
        Read The Question
      </h1>

      <h2 style={headingStyles}>
        TopicPapers - RAG - PRPCR
      </h2>

      {/* Filter Ragpapers and PRCC */}
      <ul style={listStyles}>
        {prpcrNodes(data).map(({ node }) => (
          <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
            <span>
              <Link
                style={linkStyle}
                to={node.frontmatter.slug}
              >
                {node.frontmatter.title} {" "}
              </Link>

            </span>

            <span>
             ({node.frontmatter.questions_count})
            </span>

          </li>
        ))}
      </ul>

      <h2 style={headingStyles}>
        TopicPapers - RAG - PRCR
      </h2>

      {/* Filter Ragpapers and PRCC */}
      <ul style={listStyles}>
        {prcrNodes(data).map(({ node }) => (
          <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
            <span>
              <Link
                style={linkStyle}
                to={node.frontmatter.slug}
              >
                {node.frontmatter.title} {" "}
              </Link>

            </span>
            <span>
             ({node.frontmatter.questions_count})
            </span>

          </li>
        ))}
      </ul>

      <h2 style={headingStyles}>
        TopicPapers - RAG - Not Started
      </h2>

      <ul style={listStyles}>
        {notstartedNodes(data).map(({ node }) => (
          <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
            <span>
              <Link
                style={linkStyle}
                to={node.frontmatter.slug}
              >
                {node.frontmatter.title} {" "}
              </Link>

            </span>
            <span>
             ({node.frontmatter.questions_count})
            </span>

          </li>
        ))}
      </ul>

      <h2 style={headingStyles}>
        TopicPapers - RAG - PRCC
      </h2>

      {/* Filter Ragpapers and PRCC */}
      <ul style={listStyles}>
        {prccNodes(data).map(({ node }) => (
          <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
            <span>
              <Link
                style={linkStyle}
                to={node.frontmatter.slug}
              >
                {node.frontmatter.title} {" "} 
              </Link>

            </span>
            <span>
             ({node.frontmatter.questions_count})
            </span>

          </li>
        ))}
      </ul>


      <h2 style={headingStyles}>
        TopicPapers - RAG
      </h2>

      {/* Filter Rest */}
      <ul style={listStyles}>
        {restOfNodes(data).map(({ node }) => (
          <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
            <span>
              <Link
                style={linkStyle}
                to={node.frontmatter.slug}
              >
                {node.frontmatter.title} {" "}
              </Link>

            </span>
            <span>
             ({node.frontmatter.questions_count})
            </span>

          </li>
        ))}
      </ul>

      <h2 style={headingStyles}>
        TopicPapers - Blocked
      </h2>

      {/* Filter Ragpapers and Blocked */}
      <ul style={listStyles}>
        {blockedNodes(data).map(({ node }) => (
          <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
            <span>
              <Link
                style={linkStyle}
                to={node.frontmatter.slug}
              >
                {node.frontmatter.title} {" "}
              </Link>

            </span>
            <span>
             ({node.frontmatter.questions_count})
            </span>

          </li>
        ))}
      </ul>





      <h2 style={headingStyles}>
        TopicPapers
      </h2>

      <ul style={listStyles}>
        {data.allMarkdownRemark.edges.filter(({ node }) => (node.frontmatter.slug.startsWith("topicpapers"))).map(({ node }) => (
          <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
            <span>
              <Link
                style={linkStyle}
                to={node.frontmatter.slug}
              >
                {node.frontmatter.title} {" "} 
              </Link>

            </span>
            <span>
             ({node.frontmatter.questions_count})
            </span>

          </li>
        ))}
      </ul>



      <h2 style={headingStyles}>
        Owners
      </h2>

      <ul style={listStyles}>
        {data.allMarkdownRemark.edges.filter(({ node }) => (node.frontmatter.slug.startsWith("owners"))).map(({ node }) => (
          <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
            <span>
              <Link
                style={linkStyle}
                to={node.frontmatter.slug}
              >
                {node.frontmatter.title} {" "} 
              </Link>

            </span>
            <span>
             ({node.frontmatter.questions_count})
            </span>

          </li>
        ))}
      </ul>

      <h2 style={headingStyles}>
        Reviewers
      </h2>

      <ul style={listStyles}>
        {data.allMarkdownRemark.edges.filter(({ node }) => (node.frontmatter.slug.startsWith("reviewers"))).map(({ node }) => (
          <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
            <span>
              <Link
                style={linkStyle}
                to={node.frontmatter.slug}
              >
                {node.frontmatter.title} {" "} 
              </Link>

            </span>
            <span>
             ({node.frontmatter.questions_count})
            </span>

          </li>
        ))}
      </ul>

      <h2 style={headingStyles}>
        Topics
      </h2>

      <ul style={listStyles}>
        {data.allMarkdownRemark.edges.filter(({ node }) => (node.frontmatter.slug.startsWith("topics"))).map(({ node }) => (
          <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
            <span>
              <Link
                style={linkStyle}
                to={node.frontmatter.slug}
              >
                {node.frontmatter.title} {" "} 
              </Link>

            </span>
            <span>
             ({node.frontmatter.questions_count})
            </span>

          </li>
        ))}
      </ul>

      <h2 style={headingStyles}>
        Papers
      </h2>

      <ul style={listStyles}>
        {data.allMarkdownRemark.edges.filter(({ node }) => (node.frontmatter.slug.startsWith("papers"))).map(({ node }) => (
          <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
            <span>
              <Link
                style={linkStyle}
                to={node.frontmatter.slug}
              >
                {node.frontmatter.title} {" "} 
              </Link>

            </span>
            <span>
             ({node.frontmatter.questions_count})
            </span>

          </li>
        ))}
      </ul>

    </main>
  );
}

export const query = graphql`
query {
  allMarkdownRemark(sort: {order: ASC, fields: [frontmatter___slug]}) {
    edges {
      node {
        frontmatter {
          title
          slug
          questions_count
        }
      }
    }
  }
}
`


export default IndexPage
