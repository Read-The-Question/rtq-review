module.exports = {
  siteMetadata: {
    title: `Try MD`,
    siteUrl: `https://www.yourdomain.tld`
  },
  plugins: [
    "gatsby-plugin-react-helmet",

    // "gatsby-transformer-remark", 

    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-katex`,
            options: {
              // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
              strict: `warn`,
              throwOnError: false
            }
          }
        ],
      },
    },
  
    {
        resolve: 'gatsby-source-filesystem',
        options: {
          "name": "pages",
          "path": "./src/pages/"
        },
        __key: "pages"
    }
  ]
};
