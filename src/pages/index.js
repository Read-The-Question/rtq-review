import * as React from "react"
import { Link, graphql } from 'gatsby'

// styles
const pageStyles = {
  // color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  color: "#232129",
  // backgroundColor: "#FFF4DB",
  // color: "#8A6534",
  maxWidth: 500,
  padding: 10
}

const h2HeadingStyles = {
  marginTop: 0,
  marginBottom: 64,
  color: "#232129",
  backgroundColor: "#FFF4DB",
  // color: "#8A6534",
  maxWidth: 500,
  padding: 10
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

// markup
const IndexPage = ({data}) => {
  // =========== QUESTIONS ==============

  const questionOnlyPrccNodes = (data) => {
    const filteredData = data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return slug.startsWith("questionsonlyragpapers") && 
      (
        slug.includes("-prcc") || 
        (slug.includes("-prns"))
      ) &&
      !(
        slug.includes("-g2")
      ) &&
      !(
        (slug.includes("-prrl"))
      );

    });

    return filteredData.sort((a, b) => {
      return b.node.frontmatter.questions_count - a.node.frontmatter.questions_count;
    });
  }

  const questionOnlyPrrlNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return slug.startsWith("questionsonlyragpapers") && 
      (
        slug.includes("-prrl")
      );
    });
  }

  const questionOnlyPrpcrNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return slug.startsWith("questionsonlyragpapers") && 
      (
        slug.includes("-prpcr")
      );
    });
  }

  const questionOnlyPrcrNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return slug.startsWith("questionsonlyragpapers") && 
      (
        slug.includes("-prcr")
      );
    });
  }

  const questionOnlyBlockedNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      return slug.startsWith("questionsonlyragpapers") && slug.includes("-blocked");
    });
  }

  const questionOnlyNotstartedNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      return slug.startsWith("questionsonlyragpapers") && slug.includes("-notstarted");
    });
  }


  const questionOnlyRestOfNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;

      return slug.startsWith("questionsonlyragpapers") && 
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

    // =========== ANSWERS ==============

  const phaseOnePrccNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return slug.startsWith("ragpapers") && 
      (
        slug.includes("-prcc") || 
        (slug.includes("-prns"))
      ) &&
      !(
        slug.includes("-g1") || slug.includes("-g2")
      ) &&
      !(
        (slug.includes("-prrl"))
      );

    });
  }

  const phaseTwoPrccNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return slug.startsWith("ragpapers") && 
      (
        slug.includes("-prcc") || 
        (slug.includes("-prns"))
      ) &&
      (
        slug.includes("-g1")
      ) &&
      !(
        (slug.includes("-prrl"))
      );

    });
  }

  const phaseThreePrccNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return slug.startsWith("ragpapers") && 
      (
        slug.includes("-prcc") || 
        (slug.includes("-prns"))
      ) &&
      (
        slug.includes("-g2")
      ) &&
      !(
        (slug.includes("-prrl"))
      );

    });
  }

  const phaseOnePrrlNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return slug.startsWith("ragpapers") && 
      (
        slug.includes("-prrl")
      ) &&
      !(
        slug.includes("-g1") || slug.includes("-g2")
      );
    });
  }


  const phaseTwoPrrlNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return slug.startsWith("ragpapers") && 
      (
        slug.includes("-prrl")
      ) &&
      (
        slug.includes("-g1")
      )
    });
  }

  const phaseThreePrrlNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return slug.startsWith("ragpapers") && 
      (
        slug.includes("-prrl")
      ) &&
      (
        slug.includes("-g2")
      )
    });
  }


  const phaseOnePrpcrNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return slug.startsWith("ragpapers") && 
      !(
        slug.includes("-g1") || slug.includes("-g2")
      ) &&
      (
        slug.includes("-prpcr")
      );
    });
  }

  const phaseTwoPrpcrNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return slug.startsWith("ragpapers") && 
      (
        slug.includes("-g1")
      ) &&
      (
        slug.includes("-prpcr")
      );
    });
  }

  const phaseThreePrpcrNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return slug.startsWith("ragpapers") && 
      (
        slug.includes("-g2")
      ) &&
      (
        slug.includes("-prpcr")
      );
    });
  }


  const phaseOnePrcrNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return slug.startsWith("ragpapers") && 
      !(
        slug.includes("-g1") || slug.includes("-g2")
      ) &&
      (
        slug.includes("-prcr")
      );
    });
  }

  const phaseTwoPrcrNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return slug.startsWith("ragpapers") && 
      (
        slug.includes("-g1")
      ) &&
      (
        slug.includes("-prcr")
      );
    });
  }

  const phaseThreePrcrNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return slug.startsWith("ragpapers") && 
      (
        slug.includes("-g2")
      ) &&
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
        (slug.includes("-prrl")) || 
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

      <h2 style={h2HeadingStyles}>
        Answers - Review - Phase 1 (PR / OPR / G0)
      </h2>

      <h3 style={headingStyles}>
        Answers - Phase 1 - TopicPapers - RAG - PRPCR
      </h3>

      <ul style={listStyles}>
        {phaseOnePrpcrNodes(data).map(({ node }) => (
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

      <h3 style={headingStyles}>
      Answers - Phase 1 - TopicPapers - RAG - PRCR
      </h3>

      <ul style={listStyles}>
        {phaseOnePrcrNodes(data).map(({ node }) => (
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

      <h3 style={headingStyles}>
      Answers - Phase 1 - TopicPapers - RAG - Not Started
      </h3>

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

      <h3 style={headingStyles}>
      Answers - Phase 1 - TopicPapers - RAG - PRCC / PRNS
      </h3>

      {/* Filter Ragpapers and PRCC */}
      <ul style={listStyles}>
        {phaseOnePrccNodes(data).map(({ node }) => (
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

      <h3 style={headingStyles}>
      Answers - Phase 1 - TopicPapers - RAG - PRRL
      </h3>

      <ul style={listStyles}>
        {phaseOnePrrlNodes(data).map(({ node }) => (
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

      <h2 style={h2HeadingStyles}>
        Answers - Review - Phase 2 (G1)
      </h2>

      <h3 style={headingStyles}>
        Answers - Phase 2 - TopicPapers - RAG - PRPCR
      </h3>

      <ul style={listStyles}>
        {phaseTwoPrpcrNodes(data).map(({ node }) => (
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

      <h3 style={headingStyles}>
      Answers - Phase 2 - TopicPapers - RAG - PRCR
      </h3>

      <ul style={listStyles}>
        {phaseTwoPrcrNodes(data).map(({ node }) => (
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

      <h3 style={headingStyles}>
      Answers - Phase 2 - TopicPapers - RAG - PRCC / PRNS
      </h3>

      {/* Filter Ragpapers and PRCC */}
      <ul style={listStyles}>
        {phaseTwoPrccNodes(data).map(({ node }) => (
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

      <h3 style={headingStyles}>
      Answers - Phase 2 - TopicPapers - RAG - PRRL
      </h3>

      {/* Filter Ragpapers and PRCC */}
      <ul style={listStyles}>
        {phaseTwoPrrlNodes(data).map(({ node }) => (
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

      <h2 style={h2HeadingStyles}>
        Answers - Review - Phase 3 (G2)
      </h2>

      <h3 style={headingStyles}>
        Answers - Phase 3 - TopicPapers - RAG - PRPCR
      </h3>

      <ul style={listStyles}>
        {phaseThreePrpcrNodes(data).map(({ node }) => (
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

      <h3 style={headingStyles}>
      Answers - Phase 3 - TopicPapers - RAG - PRCR
      </h3>

      <ul style={listStyles}>
        {phaseThreePrcrNodes(data).map(({ node }) => (
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

      <h3 style={headingStyles}>
      Answers - Phase 3 - TopicPapers - RAG - PRCC / PRNS
      </h3>

      {/* Filter Ragpapers and PRCC */}
      <ul style={listStyles}>
        {phaseThreePrccNodes(data).map(({ node }) => (
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

      <h3 style={headingStyles}>
      Answers - Phase 3 - TopicPapers - RAG - PRRL
      </h3>

      {/* Filter Ragpapers and PRCC */}
      <ul style={listStyles}>
        {phaseThreePrrlNodes(data).map(({ node }) => (
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

      <h2 style={h2HeadingStyles}>
        Answers - Review - RAG Papers
      </h2>

      <h3 style={headingStyles}>
      Answers - TopicPapers - RAG
      </h3>

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

      <h3 style={headingStyles}>
      Answers - TopicPapers - Blocked
      </h3>

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





      <h2 style={h2HeadingStyles}>
      Answers - TopicPapers
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


      <h3 style={headingStyles}>
        Questions - TopicPapers - RAG - PRPCR
      </h3>

      <ul style={listStyles}>
        {questionOnlyPrpcrNodes(data).map(({ node }) => (
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

      <h3 style={headingStyles}>
      Questions - TopicPapers - RAG - PRCR
      </h3>

      <ul style={listStyles}>
        {questionOnlyPrcrNodes(data).map(({ node }) => (
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

      <h3 style={headingStyles}>
      Questions - TopicPapers - RAG - Not Started
      </h3>

      <ul style={listStyles}>
        {questionOnlyNotstartedNodes(data).map(({ node }) => (
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

      <h3 style={headingStyles}>
      Questions - TopicPapers - RAG - PRCC
      </h3>

      <ul style={listStyles}>
        {questionOnlyPrccNodes(data).map(({ node }) => (
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

      <h3 style={headingStyles}>
      Questions - TopicPapers - RAG - PRRL
      </h3>

      <ul style={listStyles}>
        {questionOnlyPrrlNodes(data).map(({ node }) => (
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

      <h3 style={headingStyles}>
      Questions - TopicPapers - RAG
      </h3>

      {/* Filter Rest */}
      <ul style={listStyles}>
        {questionOnlyRestOfNodes(data).map(({ node }) => (
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

      <h3 style={headingStyles}>
      Questions - TopicPapers - Blocked
      </h3>

      {/* Filter Ragpapers and Blocked */}
      <ul style={listStyles}>
        {questionOnlyBlockedNodes(data).map(({ node }) => (
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





      <h3 style={headingStyles}>
      Questions - TopicPapers
      </h3>

      <ul style={listStyles}>
        {data.allMarkdownRemark.edges.filter(({ node }) => (node.frontmatter.slug.startsWith("questionsonlytopicpapers"))).map(({ node }) => (
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



      <h3 style={headingStyles}>
      Answers - Owners
      </h3>

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

      <h3 style={headingStyles}>
      Answers - Reviewers
      </h3>

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

      <h3 style={headingStyles}>
      Answers -  Topics
      </h3>

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

      <h3 style={headingStyles}>
      Answers - Papers
      </h3>

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
