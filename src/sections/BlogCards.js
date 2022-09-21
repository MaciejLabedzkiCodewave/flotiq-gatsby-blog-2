import React from 'react';
import moment from 'moment';
import { Link } from 'gatsby';
import Card from '../components/Card';

const BlogCards = ({ posts }) => (
    <>
        {posts.map((post) => (
            <Link to={`/${post.slug}`}>
                <Card
                    key={post.id}
                    image={post.headerImage[0] && post.headerImage[0].localFile}
                    title={post.title}
                    excerpt={post.excerpt}
                    date={moment(post.flotiqInternal.createdAt).format('Do MMMM yyyy')}
                    readingTime="7 min"
                    tags={[]} // Example: ['#photo', '#cookig', '#food']
                />
            </Link>
        ))}
    </>
);

export default BlogCards;
