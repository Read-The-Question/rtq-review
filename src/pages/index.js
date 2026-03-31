import * as React from "react";
import { Link, graphql } from "gatsby";

// styles
const pageStyles = {
  // color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  color: "#232129",
  // backgroundColor: "#FFF4DB",
  // color: "#8A6534",
  maxWidth: 600,
  padding: 10,
};

const h2HeadingStyles = {
  marginTop: 0,
  marginBottom: 64,
  color: "#232129",
  backgroundColor: "#FFF4DB",
  // color: "#8A6534",
  maxWidth: 720,
  padding: 10,
};

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
  listStyle: "decimal",
};

const listItemStyles = {
  fontWeight: 300,
  fontSize: 24,
  maxWidth: 560,
  marginBottom: 15,
};

const linkStyle = {
  color: "#8954A8",
  fontWeight: "bold",
  fontSize: 16,
  verticalAlign: "5%",
};

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
const IndexPage = ({ data }) => {
  const showAnswersForDevelopersPhaseZero = () => {
    return (
      process.env.GATSBY_REVIEW_MODE === "all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_developers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_developers_p0"
    );
  };

  const showAnswersForDevelopersPhaseOne = () => {
    return (
      process.env.GATSBY_REVIEW_MODE === "all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_developers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_developers_p1"
    );
  };

  const showAnswersForDevelopersPhaseTwo = () => {
    return (
      process.env.GATSBY_REVIEW_MODE === "all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_developers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_developers_p2"
    );
  };

  const showAnswersForDevelopersPhaseThree = () => {
    return (
      process.env.GATSBY_REVIEW_MODE === "all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_developers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_developers_p3"
    );
  };

  const showAnswersForDevelopersPhaseFour = () => {
    return (
      process.env.GATSBY_REVIEW_MODE === "all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_developers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_developers_ng1"
    );
  };

  const showAnswersForPapersTopicPapers = () => {
    return (
      process.env.GATSBY_REVIEW_MODE === "all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_papers"
    );
  };

  const showQuestionsForDevelopersPhaseZero = () => {
    return (
      process.env.GATSBY_REVIEW_MODE === "all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_developers_all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_developers_p0"
    );
  };

  const showQuestionsForDevelopersPhaseOne = () => {
    return (
      process.env.GATSBY_REVIEW_MODE === "all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_developers_all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_developers_p1"
    );
  };

  const showQuestionsForDevelopersPhaseTwo = () => {
    return (
      process.env.GATSBY_REVIEW_MODE === "all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_developers_all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_developers_p2"
    );
  };

  const showQuestionsForDevelopersPhaseThree = () => {
    return (
      process.env.GATSBY_REVIEW_MODE === "all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_developers_all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_developers_p3"
    );
  };

  const showAnswersForReviewersPhaseZero = () => {
    return (
      process.env.GATSBY_REVIEW_MODE === "all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_reviewers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_reviewers_p0"
    );
  };

  const showAnswersForReviewersPhaseOne = () => {
    return (
      process.env.GATSBY_REVIEW_MODE === "all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_reviewers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_reviewers_p1"
    );
  };

  const showAnswersForReviewersPhaseTwo = () => {
    return (
      process.env.GATSBY_REVIEW_MODE === "all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_reviewers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_reviewers_p2"
    );
  };

  const showAnswersForReviewersPhaseThree = () => {
    return (
      process.env.GATSBY_REVIEW_MODE === "all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_reviewers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_reviewers_p3"
    );
  };

  const showAnswersForReviewersPhaseFour = () => {
    return (
      process.env.GATSBY_REVIEW_MODE === "all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_reviewers_all" ||
      process.env.GATSBY_REVIEW_MODE === "answers_reviewers_ng1"
    );
  };

  const showQuestionsForReviewersPhaseZero = () => {
    return (
      process.env.GATSBY_REVIEW_MODE === "all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_reviewers_all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_reviewers_p0"
    );
  };

  const showQuestionsForReviewersPhaseOne = () => {
    return (
      process.env.GATSBY_REVIEW_MODE === "all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_reviewers_all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_reviewers_p1"
    );
  };

  const showQuestionsForReviewersPhaseTwo = () => {
    return (
      process.env.GATSBY_REVIEW_MODE === "all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_reviewers_all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_reviewers_p2"
    );
  };

  const showQuestionsForReviewersPhaseThree = () => {
    return (
      process.env.GATSBY_REVIEW_MODE === "all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_reviewers_all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_reviewers_p3"
    );
  };

  const showQuestionsPapersTopicPapers = () => {
    return (
      process.env.GATSBY_REVIEW_MODE === "all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_all" ||
      process.env.GATSBY_REVIEW_MODE === "questions_papers"
    );
  };

  // =========== QUESTIONS ==============
  const phaseZeroQuestionsOnlyPrpccNodes = (data) => {
    const filteredData = data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("questionsonlyragpapers") &&
        slug.includes("-prpcc") &&
        !(slug.includes("-g1") || slug.includes("-g2")) &&
        !slug.includes("-prrl")
      );
    });

    return filteredData.sort((a, b) => {
      return (
        b.node.frontmatter.questions_count - a.node.frontmatter.questions_count
      );
    });
  };

  const phaseOneQuestionsOnlyPrpccNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("questionsonlyragpapers") &&
        slug.includes("-prpcc") &&
        slug.includes("-g1") &&
        !slug.includes("-prrl")
      );
    });
  };

  const phaseTwoQuestionsOnlyPrpccNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("questionsonlyragpapers") &&
        slug.includes("-prpcc") &&
        slug.includes("-g2") &&
        !slug.includes("-prrl")
      );
    });
  };

  const phaseThreeQuestionsOnlyPrpccNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("questionsonlyragpapers") &&
        slug.includes("-prpcc") &&
        slug.includes("-g3") &&
        !slug.includes("-prrl")
      );
    });
  };

  const phaseZeroQuestionsOnlyPrccNodes = (data) => {
    const filteredData = data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("questionsonlyragpapers") &&
        (slug.includes("-prcc") || slug.includes("-prns")) &&
        !(slug.includes("-g1") || slug.includes("-g2")) &&
        !slug.includes("-prrl")
      );
    });

    return filteredData.sort((a, b) => {
      return (
        b.node.frontmatter.questions_count - a.node.frontmatter.questions_count
      );
    });
  };

  const phaseOneQuestionsOnlyPrccNodes = (data) => {
    const filteredData = data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("questionsonlyragpapers") &&
        (slug.includes("-prcc") || slug.includes("-prns")) &&
        slug.includes("-g1") &&
        !slug.includes("-prrl")
      );
    });

    return filteredData.sort((a, b) => {
      return (
        b.node.frontmatter.questions_count - a.node.frontmatter.questions_count
      );
    });
  };

  const phaseTwoQuestionsOnlyPrccNodes = (data) => {
    const filteredData = data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("questionsonlyragpapers") &&
        (slug.includes("-prcc") || slug.includes("-prns")) &&
        slug.includes("-g2") &&
        !slug.includes("-prrl")
      );
    });

    return filteredData.sort((a, b) => {
      return (
        b.node.frontmatter.questions_count - a.node.frontmatter.questions_count
      );
    });
  };

  const phaseThreeQuestionsOnlyPrccNodes = (data) => {
    const filteredData = data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("questionsonlyragpapers") &&
        (slug.includes("-prcc") || slug.includes("-prns")) &&
        slug.includes("-g3") &&
        !slug.includes("-prrl")
      );
    });

    return filteredData.sort((a, b) => {
      return (
        b.node.frontmatter.questions_count - a.node.frontmatter.questions_count
      );
    });
  };

  const phaseZeroQuestionsOnlyPrrlNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("questionsonlyragpapers") &&
        slug.includes("-prrl") &&
        !(slug.includes("-g1") || slug.includes("-g2"))
      );
    });
  };

  const phaseOneQuestionsOnlyPrrlNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("questionsonlyragpapers") &&
        slug.includes("-prrl") &&
        slug.includes("-g1")
      );
    });
  };

  const phaseTwoQuestionsOnlyPrrlNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("questionsonlyragpapers") &&
        slug.includes("-prrl") &&
        slug.includes("-g2")
      );
    });
  };

  const phaseThreeQuestionsOnlyPrrlNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("questionsonlyragpapers") &&
        slug.includes("-prrl") &&
        slug.includes("-g3")
      );
    });
  };

  const phaseZeroQuestionsOnlyPrpcrNodes = (data) => {
    const filteredData = data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("questionsonlyragpapers") &&
        !(slug.includes("-g1") || slug.includes("-g2")) &&
        slug.includes("-prpcr")
      );
    });

    return filteredData.sort((a, b) => {
      return (
        b.node.frontmatter.questions_count - a.node.frontmatter.questions_count
      );
    });
  };

  const phaseOneQuestionsOnlyPrpcrNodes = (data) => {
    const filteredData = data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("questionsonlyragpapers") &&
        slug.includes("-g1") &&
        slug.includes("-prpcr")
      );
    });

    return filteredData.sort((a, b) => {
      return (
        b.node.frontmatter.questions_count - a.node.frontmatter.questions_count
      );
    });
  };

  const phaseTwoQuestionsOnlyPrpcrNodes = (data) => {
    const filteredData = data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("questionsonlyragpapers") &&
        slug.includes("-g2") &&
        slug.includes("-prpcr")
      );
    });

    return filteredData.sort((a, b) => {
      return (
        b.node.frontmatter.questions_count - a.node.frontmatter.questions_count
      );
    });
  };

  const phaseThreeQuestionsOnlyPrpcrNodes = (data) => {
    const filteredData = data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("questionsonlyragpapers") &&
        slug.includes("-g3") &&
        slug.includes("-prpcr")
      );
    });

    return filteredData.sort((a, b) => {
      return (
        b.node.frontmatter.questions_count - a.node.frontmatter.questions_count
      );
    });
  };

  const phaseZeroQuestionsOnlyPrcrNodes = (data) => {
    const filteredData = data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("questionsonlyragpapers") &&
        !(slug.includes("-g1") || slug.includes("-g2")) &&
        slug.includes("-prcr")
      );
    });

    return filteredData.sort((a, b) => {
      return (
        b.node.frontmatter.questions_count - a.node.frontmatter.questions_count
      );
    });
  };

  const phaseOneQuestionsOnlyPrcrNodes = (data) => {
    const filteredData = data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("questionsonlyragpapers") &&
        slug.includes("-g1") &&
        slug.includes("-prcr")
      );
    });

    return filteredData.sort((a, b) => {
      return (
        b.node.frontmatter.questions_count - a.node.frontmatter.questions_count
      );
    });
  };

  const phaseTwoQuestionsOnlyPrcrNodes = (data) => {
    const filteredData = data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("questionsonlyragpapers") &&
        slug.includes("-g2") &&
        slug.includes("-prcr")
      );
    });

    return filteredData.sort((a, b) => {
      return (
        b.node.frontmatter.questions_count - a.node.frontmatter.questions_count
      );
    });
  };

  const phaseThreeQuestionsOnlyPrcrNodes = (data) => {
    const filteredData = data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("questionsonlyragpapers") &&
        slug.includes("-g3") &&
        slug.includes("-prcr")
      );
    });

    return filteredData.sort((a, b) => {
      return (
        b.node.frontmatter.questions_count - a.node.frontmatter.questions_count
      );
    });
  };

  const questionsOnlyBlockedNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      return (
        slug.startsWith("questionsonlyragpapers") &&
        (slug.includes("-blocked") || slug.includes("-red"))
      );
    });
  };

  const questionsOnlyNotstartedNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      return (
        slug.startsWith("questionsonlyragpapers") &&
        slug.includes("-notstarted")
      );
    });
  };

  const questionsOnlyRestOfNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;

      return (
        slug.startsWith("questionsonlyragpapers") &&
        !(
          slug.includes("-blocked") ||
          slug.includes("-red") ||
          slug.includes("-notstarted") ||
          slug.includes("-prcc") ||
          slug.includes("-prpcc") ||
          slug.includes("-prcr") ||
          slug.includes("-prrl") ||
          slug.includes("-prpcr") ||
          slug.includes("-prns")
        )
      );
    });
  };

  const questionsOnlyFullTopicPaperNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;

      return (
        slug.startsWith("questionsonlytopicpapers") &&
        !(
          slug.includes("-blocked") ||
          slug.includes("-red") ||
          slug.includes("-notstarted") ||
          slug.includes("-prcc") ||
          slug.includes("-prpcc") ||
          slug.includes("-prrl") ||
          slug.includes("-prcr") ||
          slug.includes("-prpcr") ||
          slug.includes("-prns")
        )
      );
    });
  };

  const questionsOnlyFullPaperNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;

      return (
        slug.startsWith("questionsonlypapers") &&
        !(
          slug.includes("-blocked") ||
          slug.includes("-red") ||
          slug.includes("-notstarted") ||
          slug.includes("-prcc") ||
          slug.includes("-prpcc") ||
          slug.includes("-prrl") ||
          slug.includes("-prcr") ||
          slug.includes("-prpcr") ||
          slug.includes("-prns")
        )
      );
    });
  };

  // =========== ANSWERS ==============

  const phaseZeroPrpccNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        slug.includes("-prpcc") &&
        !(slug.includes("-g1") || slug.includes("-g2")) &&
        !slug.includes("-prrl")
      );
    });
  };

  const phaseOnePrpccNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        slug.includes("-prpcc") &&
        slug.includes("-g1") &&
        !slug.includes("-prrl")
      );
    });
  };

  const phaseTwoPrpccNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        slug.includes("-prpcc") &&
        slug.includes("-g2") &&
        !slug.includes("-prrl")
      );
    });
  };

  const phaseThreePrpccNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        slug.includes("-prpcc") &&
        slug.includes("-g3") &&
        !slug.includes("-prrl")
      );
    });
  };

  const phaseFourPrpccNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        slug.includes("-prpcc") &&
        slug.includes("-ng1") &&
        !slug.includes("-prrl")
      );
    });
  };

  const phaseZeroPrccNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        (slug.includes("-prcc") || slug.includes("-prns")) &&
        !(slug.includes("-g1") || slug.includes("-g2")) &&
        !slug.includes("-prrl")
      );
    });
  };

  const phaseOnePrccNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        (slug.includes("-prcc") || slug.includes("-prns")) &&
        slug.includes("-g1") &&
        !slug.includes("-prrl")
      );
    });
  };

  const phaseTwoPrccNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        (slug.includes("-prcc") || slug.includes("-prns")) &&
        slug.includes("-g2") &&
        !slug.includes("-prrl")
      );
    });
  };

  const phaseThreePrccNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        (slug.includes("-prcc") || slug.includes("-prns")) &&
        slug.includes("-g3") &&
        !slug.includes("-prrl")
      );
    });
  };

  const phaseFourPrccNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        (slug.includes("-prcc") || slug.includes("-prns")) &&
        slug.includes("-ng1") &&
        !slug.includes("-prrl")
      );
    });
  };

  const phaseZeroPrrlNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        slug.includes("-prrl") &&
        !(slug.includes("-g1") || slug.includes("-g2"))
      );
    });
  };

  const phaseOnePrrlNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        slug.includes("-prrl") &&
        slug.includes("-g1")
      );
    });
  };

  const phaseTwoPrrlNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        slug.includes("-prrl") &&
        slug.includes("-g2")
      );
    });
  };

  const phaseThreePrrlNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        slug.includes("-prrl") &&
        slug.includes("-g3")
      );
    });
  };

  const phaseFourPrrlNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        slug.includes("-prrl") &&
        slug.includes("-ng1")
      );
    });
  };

  const phaseZeroPrpcrNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        !(slug.includes("-g1") || slug.includes("-g2")) &&
        slug.includes("-prpcr")
      );
    });
  };

  const phaseOnePrpcrNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        slug.includes("-g1") &&
        slug.includes("-prpcr")
      );
    });
  };

  const phaseTwoPrpcrNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        slug.includes("-g2") &&
        slug.includes("-prpcr")
      );
    });
  };

  const phaseThreePrpcrNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        slug.includes("-g3") &&
        slug.includes("-prpcr")
      );
    });
  };

  const phaseFourPrpcrNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        slug.includes("-ng1") &&
        slug.includes("-prpcr")
      );
    });
  };

  const phaseZeroPrcrNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        !(slug.includes("-g1") || slug.includes("-g2")) &&
        slug.includes("-prcr")
      );
    });
  };

  const phaseOnePrcrNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        slug.includes("-g1") &&
        slug.includes("-prcr")
      );
    });
  };

  const phaseTwoPrcrNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        slug.includes("-g2") &&
        slug.includes("-prcr")
      );
    });
  };

  const phaseThreePrcrNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        slug.includes("-g3") &&
        slug.includes("-prcr")
      );
    });
  };

  const phaseFourPrcrNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      // console.log(slug);
      return (
        slug.startsWith("ragpapers") &&
        slug.includes("-ng1") &&
        slug.includes("-prcr")
      );
    });
  };

  const blockedNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      return (
        slug.startsWith("ragpapers") &&
        (slug.includes("-blocked") || slug.includes("-red"))
      );
    });
  };

  const notstartedNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;
      return slug.startsWith("ragpapers") && slug.includes("-notstarted");
    });
  };

  const restOfNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;

      return (
        slug.startsWith("ragpapers") &&
        !(
          slug.includes("-blocked") ||
          slug.includes("-red") ||
          slug.includes("-notstarted") ||
          slug.includes("-prcc") ||
          slug.includes("-prpcc") ||
          slug.includes("-prcr") ||
          slug.includes("-prrl") ||
          slug.includes("-prpcr") ||
          slug.includes("-prns")
        )
      );
    });
  };

  const fullTopicNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;

      return (
        slug.startsWith("topics") &&
        !(
          // slug.includes("-blocked") ||
          // slug.includes("-red") ||
          // slug.includes("-notstarted") ||
          (
            slug.includes("-prcc") ||
            slug.includes("-prpcc") ||
            slug.includes("-prrl") ||
            slug.includes("-prcr") ||
            slug.includes("-prpcr") ||
            slug.includes("-prns")
          )
        )
      );
    });
  };

  const fullTopicPaperNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;

      return (
        slug.startsWith("topicpapers") &&
        !(
          slug.includes("-blocked") ||
          slug.includes("-red") ||
          slug.includes("-notstarted") ||
          slug.includes("-prcc") ||
          slug.includes("-prpcc") ||
          slug.includes("-prrl") ||
          slug.includes("-prcr") ||
          slug.includes("-prpcr") ||
          slug.includes("-prns")
        )
      );
    });
  };

  const fullPaperNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;

      return (
        slug.startsWith("papers") &&
        !(
          slug.includes("-blocked") ||
          slug.includes("-red") ||
          slug.includes("-notstarted") ||
          slug.includes("-prcc") ||
          slug.includes("-prpcc") ||
          slug.includes("-prrl") ||
          slug.includes("-prcr") ||
          slug.includes("-prpcr") ||
          slug.includes("-prns")
        )
      );
    });
  };

  const fullAiPaperNodes = (data) => {
    return data.allMarkdownRemark.edges.filter(({ node }) => {
      const slug = node.frontmatter.slug;

      return (
        slug.startsWith("aipapers") &&
        !(
          slug.includes("-blocked") ||
          slug.includes("-red") ||
          slug.includes("-notstarted") ||
          slug.includes("-prcc") ||
          slug.includes("-prpcc") ||
          slug.includes("-prrl") ||
          slug.includes("-prcr") ||
          slug.includes("-prpcr") ||
          slug.includes("-prns")
        )
      );
    });
  };

  return (
    <main style={pageStyles}>
      <title>Home Page</title>
      <h1 style={headingStyles}>Read The Question</h1>

      {showAnswersForDevelopersPhaseZero() && (
        <>
          <h2 style={h2HeadingStyles}>
            Answers - Developer - Phase 0 (PR / OPR / G0 -> G1 / G2)
          </h2>

          <h3 style={headingStyles}>
            Answers - Phase 0 - TopicPapers - RAG - PRPCR
          </h3>

          <ul style={listStyles}>
            {phaseZeroPrpcrNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>

                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>
            Answers - Phase 0 - TopicPapers - RAG - PRCR
          </h3>

          <ul style={listStyles}>
            {phaseZeroPrcrNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>
            Answers - Phase 0 - TopicPapers - RAG - Not Started
          </h3>

          <ul style={listStyles}>
            {notstartedNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {showAnswersForReviewersPhaseZero() && (
        <>
          <h2 style={h2HeadingStyles}>
            Answers - Reviewer - Phase 0 (PR / OPR / G0 -> G1 / G2)
          </h2>

          <h3 style={headingStyles}>
            Answers - Phase 0 - TopicPapers - RAG - PRPCC
          </h3>

          {/* Filter Ragpapers and PRCC */}
          <ul style={listStyles}>
            {phaseZeroPrpccNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>
            Answers - Phase 0 - TopicPapers - RAG - PRCC / PRNS
          </h3>

          {/* Filter Ragpapers and PRCC */}
          <ul style={listStyles}>
            {phaseZeroPrccNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>
            Answers - Phase 0 - TopicPapers - RAG - PRRL
          </h3>

          <ul style={listStyles}>
            {phaseZeroPrrlNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {showAnswersForDevelopersPhaseOne() && (
        <>
          <h2 style={h2HeadingStyles}>
            Answers - Developer - Phase 1 (G1 -> G2)
          </h2>

          <h3 style={headingStyles}>
            Answers - Phase 1 - TopicPapers - RAG - PRPCR
          </h3>

          <ul style={listStyles}>
            {phaseOnePrpcrNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>

                <span>({node.frontmatter.questions_count})</span>
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
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {showAnswersForReviewersPhaseOne() && (
        <>
          <h2 style={h2HeadingStyles}>
            Answers - Reviewer - Phase 1 (G1 -> G2)
          </h2>

          <h3 style={headingStyles}>
            Answers - Phase 1 - TopicPapers - RAG - PRPCC
          </h3>

          {/* Filter Ragpapers and PRCC */}
          <ul style={listStyles}>
            {phaseOnePrpccNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
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
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>
            Answers - Phase 1 - TopicPapers - RAG - PRRL
          </h3>

          {/* Filter Ragpapers and PRCC */}
          <ul style={listStyles}>
            {phaseOnePrrlNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {showAnswersForDevelopersPhaseTwo() && (
        <>
          <h2 style={h2HeadingStyles}>
            Answers - Developer - Phase 2 (G2 -> G3)
          </h2>

          <h3 style={headingStyles}>
            Answers - Phase 2 - TopicPapers - RAG - PRPCR
          </h3>

          <ul style={listStyles}>
            {phaseTwoPrpcrNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>

                <span>({node.frontmatter.questions_count})</span>
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
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {showAnswersForReviewersPhaseTwo() && (
        <>
          <h2 style={h2HeadingStyles}>
            Answers - Reviewer - Phase 2 (G2 -> G3)
          </h2>

          <h3 style={headingStyles}>
            Answers - Phase 2 - TopicPapers - RAG - PRPCC
          </h3>

          {/* Filter Ragpapers and PRCC */}
          <ul style={listStyles}>
            {phaseTwoPrpccNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
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
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
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
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {showAnswersForDevelopersPhaseThree() && (
        <>
          <h2 style={h2HeadingStyles}>
            Answers - Developer - Phase 3 (G3 -> G4)
          </h2>

          <h3 style={headingStyles}>
            Answers - Phase 3 - TopicPapers - RAG - PRPCR
          </h3>

          <ul style={listStyles}>
            {phaseThreePrpcrNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>

                <span>({node.frontmatter.questions_count})</span>
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
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {showAnswersForReviewersPhaseThree() && (
        <>
          <h2 style={h2HeadingStyles}>
            Answers - Reviewer - Phase 3 (G3 -> G4)
          </h2>

          <h3 style={headingStyles}>
            Answers - Phase 3 - TopicPapers - RAG - PRPCC
          </h3>

          {/* Filter Ragpapers and PRCC */}
          <ul style={listStyles}>
            {phaseThreePrpccNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
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
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
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
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {showAnswersForDevelopersPhaseFour() && (
        <>
          <h2 style={h2HeadingStyles}>
            Answers - Developer - Phase 4 (NG1 -> NG2)
          </h2>

          <h3 style={headingStyles}>
            Answers - Phase 4 - TopicPapers - RAG - PRPCR
          </h3>

          <ul style={listStyles}>
            {phaseFourPrpcrNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>

                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>
            Answers - Phase 4 - TopicPapers - RAG - PRCR
          </h3>

          <ul style={listStyles}>
            {phaseFourPrcrNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {showAnswersForReviewersPhaseFour() && (
        <>
          <h2 style={h2HeadingStyles}>
            Answers - Reviewer - Phase 4 (NG1 -> NG2)
          </h2>

          <h3 style={headingStyles}>
            Answers - Phase 4 - TopicPapers - RAG - PRPCC
          </h3>

          {/* Filter Ragpapers and PRCC */}
          <ul style={listStyles}>
            {phaseFourPrpccNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>
            Answers - Phase 4 - TopicPapers - RAG - PRCC / PRNS
          </h3>

          {/* Filter Ragpapers and PRCC */}
          <ul style={listStyles}>
            {phaseFourPrccNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>
            Answers - Phase 4 - TopicPapers - RAG - PRRL
          </h3>

          {/* Filter Ragpapers and PRCC */}
          <ul style={listStyles}>
            {phaseFourPrrlNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {showAnswersForPapersTopicPapers() && (
        <>
          <h2 style={h2HeadingStyles}>Answers - RAG Papers</h2>

          <h3 style={headingStyles}>Answers - TopicPapers - RAG</h3>

          {/* Filter Rest */}
          <ul style={listStyles}>
            {restOfNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>Answers - TopicPapers - Red / Blocked</h3>

          {/* Filter Ragpapers and Blocked */}
          <ul style={listStyles}>
            {blockedNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h2 style={h2HeadingStyles}>Answers - Complete Papers</h2>

          <h3 style={headingStyles}>Answers - Papers</h3>

          <ul style={listStyles}>
            {fullPaperNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>Answers - TopicPapers</h3>

          <ul style={listStyles}>
            {fullTopicPaperNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>Answers - Topics</h3>

          <ul style={listStyles}>
            {fullTopicNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>






          <h2 style={h2HeadingStyles}>AI - Answers - Complete Papers</h2>

          <h3 style={headingStyles}>AI - Answers - Papers</h3>

          <ul style={listStyles}>
            {fullAiPaperNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

        </>
      )}

      {showQuestionsForDevelopersPhaseZero() && (
        <>
          <h2 style={h2HeadingStyles}>
            Questions - Developer - Phase 0 (PR / OPR / G0 -> G1 / G2)
          </h2>

          <h3 style={headingStyles}>
            Questions - Phase 0 - TopicPapers - RAG - PRPCR
          </h3>

          <ul style={listStyles}>
            {phaseZeroQuestionsOnlyPrpcrNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>

                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>
            Questions - Phase 0 - TopicPapers - RAG - PRCR
          </h3>

          <ul style={listStyles}>
            {phaseZeroQuestionsOnlyPrcrNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>
            Questions - Phase 0 - TopicPapers - RAG - Not Started
          </h3>

          <ul style={listStyles}>
            {questionsOnlyNotstartedNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {showQuestionsForReviewersPhaseZero() && (
        <>
          <h2 style={h2HeadingStyles}>
            Questions - Reviewer - Phase 0 (PR / OPR / G0 -> G1 / G2)
          </h2>

          <h3 style={headingStyles}>
            Questions - Phase 0 - TopicPapers - RAG - PRPCC
          </h3>

          <ul style={listStyles}>
            {phaseZeroQuestionsOnlyPrpccNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>
            Questions - Phase 0 - TopicPapers - RAG - PRCC / PRNS
          </h3>

          <ul style={listStyles}>
            {phaseZeroQuestionsOnlyPrccNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>
            Questions - Phase 0 - TopicPapers - RAG - PRRL
          </h3>

          <ul style={listStyles}>
            {phaseZeroQuestionsOnlyPrrlNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {showQuestionsForDevelopersPhaseOne() && (
        <>
          <h2 style={h2HeadingStyles}>
            Questions - Developer - Phase 1 (G1 -> G2)
          </h2>

          <h3 style={headingStyles}>
            Questions - Phase 1 - TopicPapers - RAG - PRPCR
          </h3>

          <ul style={listStyles}>
            {phaseOneQuestionsOnlyPrpcrNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>

                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>
            Questions - Phase 1 - TopicPapers - RAG - PRCR
          </h3>

          <ul style={listStyles}>
            {phaseOneQuestionsOnlyPrcrNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {showQuestionsForReviewersPhaseOne() && (
        <>
          <h2 style={h2HeadingStyles}>
            Questions - Reviewer - Phase 1 (G1 -> G2)
          </h2>

          <h3 style={headingStyles}>
            Questions - Phase 1 - TopicPapers - RAG - PRPCC
          </h3>

          <ul style={listStyles}>
            {phaseOneQuestionsOnlyPrpccNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>
            Questions - Phase 1 - TopicPapers - RAG - PRCC / PRNS
          </h3>

          <ul style={listStyles}>
            {phaseOneQuestionsOnlyPrccNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>
            Questions - Phase 1 - TopicPapers - RAG - PRRL
          </h3>

          <ul style={listStyles}>
            {phaseOneQuestionsOnlyPrrlNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {showQuestionsForDevelopersPhaseTwo() && (
        <>
          <h2 style={h2HeadingStyles}>
            Questions - Developer - Phase 2 (G2 -> G3)
          </h2>

          <h3 style={headingStyles}>
            Questions - Phase 2 - TopicPapers - RAG - PRPCR
          </h3>

          <ul style={listStyles}>
            {phaseTwoQuestionsOnlyPrpcrNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>

                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>
            Questions - Phase 2 - TopicPapers - RAG - PRCR
          </h3>

          <ul style={listStyles}>
            {phaseTwoQuestionsOnlyPrcrNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {showQuestionsForReviewersPhaseTwo() && (
        <>
          <h2 style={h2HeadingStyles}>
            Questions - Reviewer - Phase 2 (G2 -> G3)
          </h2>

          <h3 style={headingStyles}>
            Questions - Phase 2 - TopicPapers - RAG - PRPCC
          </h3>

          <ul style={listStyles}>
            {phaseTwoQuestionsOnlyPrpccNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>
            Questions - Phase 2 - TopicPapers - RAG - PRCC / PRNS
          </h3>

          <ul style={listStyles}>
            {phaseTwoQuestionsOnlyPrccNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>
            Questions - Phase 2 - TopicPapers - RAG - PRRL
          </h3>

          <ul style={listStyles}>
            {phaseTwoQuestionsOnlyPrrlNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {showQuestionsPapersTopicPapers() && (
        <>
          <h2 style={h2HeadingStyles}>Questions - RAG Papers</h2>

          <h3 style={headingStyles}>Questions - TopicPapers - RAG</h3>

          {/* Filter Rest */}
          <ul style={listStyles}>
            {questionsOnlyRestOfNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>Questions - TopicPapers - Red / Blocked</h3>

          {/* Filter Ragpapers and Blocked */}
          <ul style={listStyles}>
            {questionsOnlyBlockedNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h2 style={h2HeadingStyles}>Questions - Complete Papers</h2>

          <h3 style={headingStyles}>Questions - Papers</h3>

          <ul style={listStyles}>
            {questionsOnlyFullPaperNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          <h3 style={headingStyles}>Questions - TopicPapers</h3>

          <ul style={listStyles}>
            {questionsOnlyFullTopicPaperNodes(data).map(({ node }) => (
              <li key={node.id} style={{ ...listItemStyles, color: "#8EB814" }}>
                <span>
                  <Link style={linkStyle} to={node.frontmatter.slug}>
                    {node.frontmatter.title}{" "}
                  </Link>
                </span>
                <span>({node.frontmatter.questions_count})</span>
              </li>
            ))}
          </ul>

          {/* <h2 style={h2HeadingStyles}>Questions - Original Papers</h2> */}
        </>
      )}

      {/* <h3 style={headingStyles}>
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
      </ul> */}

      {/* <h3 style={headingStyles}>
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
      </ul> */}

      {/* <h3 style={headingStyles}>
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
      </ul> */}

      {/* <h3 style={headingStyles}>
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
      </ul> */}
    </main>
  );
};

// export const query = graphql`
//   query {
//     allMarkdownRemark(sort: { order: ASC, fields: [frontmatter___slug] }) {
//       edges {
//         node {
//           frontmatter {
//             title
//             slug
//             questions_count
//           }
//         }
//       }
//     }
//   }
// `;

export const query = graphql`
  query {
    allMarkdownRemark(sort: { frontmatter: { slug: ASC } }) {
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
`;

export default IndexPage;
