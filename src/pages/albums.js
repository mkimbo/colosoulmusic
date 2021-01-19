import styled from '@emotion/styled';
import { Pagination } from 'antd';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import Layout from '../components/layout';
import PostCard from '../components/post-card';
import SEO from '../components/seo';
import { indexMenuLinks } from '../components/_config/menu-links';
import { flexCenter } from '../components/_shared/styled-mixins';
import { StyledFullHeightSection } from '../components/_shared/styled-section';
import { StyledPageHeader } from '../components/_shared/styled-headings';

const StyledProjectsH1 = styled(StyledPageHeader)`
  margin-top: 2rem;
  margin-bottom: 2rem;
`;
const StyledPaginationContainer = styled.div`
  ${flexCenter};
  width: 100%;
  margin-top: 2.5rem;

  & ul.ant-pagination {
    cursor: pointer;
    display: flex;
    list-style: none;

    & > li {
      ${flexCenter};
      min-width: 1rem;
    }
    & > li.ant-pagination-item {
      font-size: 1.5rem;
      padding: 0 0.25rem;
    }
    & > li.ant-pagination-disabled > a {
      color: var(--disabled-color);
    }
    & > li.ant-pagination-item-active > a {
      text-decoration: underline;
    }
  }
`;
const Albums = ({ data }) => {
  let [currentPage, setCurrentPage] = React.useState(1);

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  let paginationSize = data.site.siteMetadata.paginationPageSize;
  let leftCursor = (currentPage - 1) * paginationSize;
  let rightCursor = leftCursor + paginationSize;

  return (
    <Layout menuLinks={indexMenuLinks}>
      <SEO title="Albums" />
      <StyledFullHeightSection>
        <StyledProjectsH1>Albums</StyledProjectsH1>

        {data.allMarkdownRemark.edges.slice(leftCursor, rightCursor).map(({ node }) => {
          const coverImage = node.frontmatter.cover_image ? node.frontmatter.cover_image.childImageSharp.fluid : null;
          return (
            <PostCard
              key={node.frontmatter.title}
              coverImage={coverImage}
              title={node.frontmatter.title}
              date={node.frontmatter.date}
              description={node.frontmatter.description}
              link={`/albums${node.fields.slug}`}
              artists={node.frontmatter.artists}
            />
          );
        })}
        <StyledPaginationContainer>
          <Pagination
            pageSize={paginationSize}
            current={currentPage}
            onChange={onPaginationChange}
            total={data.allMarkdownRemark.edges.length}
          />
        </StyledPaginationContainer>
      </StyledFullHeightSection>
    </Layout>
  );
};

Albums.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Albums;

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: { order: DESC, fields: frontmatter___date }
      filter: { fileAbsolutePath: { regex: "/content/albums/" }, frontmatter: { published: { ne: false } } }
    ) {
      edges {
        node {
          frontmatter {
            title
            artists
            date(formatString: "D MMMM, YYYY")
            description
            cover_image {
              childImageSharp {
                fluid(maxWidth: 800) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          excerpt
          fields {
            slug
          }
        }
      }
    }
    site {
      siteMetadata {
        paginationPageSize
      }
    }
  }
`;
