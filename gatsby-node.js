const path = require('path');
const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

exports.createPages = async ({ graphql, actions , getCache  }) => {
    const { createPage } = actions;
    const { createNode, createNodeField } = actions;

    const blogPost = path.resolve('./src/templates/blog-post.js');
    const result = await graphql(`
      query GetBlogPosts {
        allBlogpost(sort: {fields: flotiqInternal___createdAt, order: DESC}) {
          edges {
            node {
              slug
            }
          }
        }
      }
    `);

    // const fileNode = await createRemoteFileNode({
    //   url: "https://api.flotiq.com/image/0x0/_media-686eef8b-62c1-4734-9630-8bd15e7731f7.jpg",
    //   // parentNodeId: edge.node[locale].id.toString(),
    //   parentNodeId: "blogpost-2",
    //   getCache,
    //   createNode,
    //   createNodeId: id => `projectPhoto-${photo.id}`,,
    // });

  
    if (result.errors) {
        throw result.errors;
    }
    const posts = result.data.allBlogpost.edges;

    // Create paginated index
    const postsPerPage = 4;
    const numPages = Math.ceil(posts.length / postsPerPage);

    Array.from({ length: numPages }).forEach((item, i) => {
        createPage({
            path: i === 0 ? '/' : `/${i + 1}`,
            component: path.resolve('./src/templates/index.js'),
            context: {
                limit: postsPerPage,
                skip: i * postsPerPage,
                numPages,
                currentPage: i + 1,
            },
        });
    });

    // Create blog posts pages.
    posts.forEach((post, index) => {
        const previous = index === posts.length - 1 ? null : posts[index + 1].node;
        const next = index === 0 ? null : posts[index - 1].node;

        createPage({
            path: post.node.slug,
            component: blogPost,
            context: {
                slug: post.node.slug,
                previous,
                next,
            },
        });
    });
};

exports.onCreateNode = async ({
  node,
  actions: { createNode, createNodeField },
  createNodeId,
  getCache,
}) => {
  // For direct Blogpost nodes example
  if (
    node.internal.type === "Blogpost" &&
    node.content.blocks &&
    node.content.blocks[8] &&
    node.content.blocks[8].data &&
    node.content.blocks[8].data.url !== null
  ) {
 
    const fileNode = await createRemoteFileNode({
      url: node.content.blocks[8].data.url, // string that points to the URL of the image
      parentNodeId: node.id, // id of the parent node of the fileNode you are going to create
      createNode, // helper function in gatsby-node to generate the node
      createNodeId, // helper function in gatsby-node to generate the node id
      getCache,
    })

    // if the file was created, extend the node with "localFile"
    if (fileNode) {
      createNodeField({ node, name: "localFile", value: fileNode.id })
    }
  }   
}