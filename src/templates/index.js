import React, { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';
import { Pagination } from 'flotiq-components-react'; 

const Layout = lazy(() => import('../layouts/layout'));
const HomepageSidebar = lazy(() => import('../sections/HomepageSidebar'));
const Footer = lazy(() => import('../components/Footer'));
const BlogCards = lazy(() => import('../sections/BlogCards'));

const renderLoader = () => <p>Loading</p>;

const IndexPage = ({ data, pageContext }) => {
    const posts = data.allBlogpost.nodes;
    return (
        <Suspense fallback={renderLoader()}>
            <Layout additionalClass={['']}>
                <Helmet>
                    <title>{data.site.siteMetadata.title}</title>
                    <meta
                        name="description"
                        content={data.site.siteMetadata.description}
                    />
                </Helmet>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <HomepageSidebar
                        headerText1="About"
                        headerText2="this"
                        headerText3="blog"
                        subheaderText="Hi, this is minimal theme for your personal blog.
                        With rich media Use this theme and make it special!"
                        paragraphText="Ut enim ad minim veniam, quis nostrud exercitation
                        ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                        irure dolor in reprehenderit in voluptate velit esse cillum dolore
                        eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                        sunt in culpa qui officia deserunt mollit anim id est laborum."
                        buttonLabel="SAY HI!"
                    />
                    <div className="lg:col-span-2 xl:col-span-3 p-5 md:p-10 lg:p-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                            <BlogCards posts={posts} />
                        </div>
                        <Pagination page={pageContext.currentPage} numOfPages={pageContext.numPages} rounded="none" />
                    </div>
                </div>
                <Footer additionalClass={['md:hidden']} />
            </Layout>
        </Suspense>
    );
};

export const pageQuery = graphql`
    query indexQuery($skip: Int!, $limit: Int!) {
        site {
            siteMetadata {
                title
                description
            }
        }
        allBlogpost(sort: {fields: flotiqInternal___createdAt, order: DESC}, limit: $limit, skip: $skip,) {
            nodes {
                coverImage {
                    extension
                    url
                    width
                    height
                    localFile {
                        publicURL
                        childImageSharp {
                            gatsbyImageData(layout: FULL_WIDTH, placeholder: NONE)
                        }
                    }
                }
                id
                excerpt
                slug
                title
                flotiqInternal {
                    createdAt
                }
            }
        }
    }
`;

export default IndexPage;
