import CodeBlock from '../components/CodeBlock';
import ExpansionPanel from '../components/ExpansionPanel';
import Layout from '../components/Layout';
import PropTypes from 'prop-types';
import React, {Fragment, createElement} from 'react';
import RelativeLink, {PathContext} from '../components/RelativeLink';
import Wrapper from '../components/Wrapper';
import rehypeReact from 'rehype-react';
import {
  Box,
  Button,
  Code,
  Collapse,
  Divider,
  Grid,
  Heading,
  Link,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
  chakra,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import {Link as GatsbyLink, graphql} from 'gatsby';
import {Helmet} from 'react-helmet';
import {MDXProvider} from '@mdx-js/react';
import {MDXRenderer} from 'gatsby-plugin-mdx';
import {dirname, join, relative} from 'path-browserify';

const components = {
  a: RelativeLink,
  pre: CodeBlock,
  p: Text,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem
};

const mdxComponents = {
  ...components,
  wrapper: Wrapper,
  inlineCode: Code,
  Button,
  ExpansionPanel
};

const renderAst = new rehypeReact({
  createElement,
  Fragment,
  components: {
    ...components,
    code: Code
  }
}).Compiler;

function NavGroup({label, uri, items, basePath}) {
  const {isOpen, onToggle} = useDisclosure();
  return (
    <div>
      <Button onClick={onToggle}>{label}</Button>
      <Collapse in={isOpen}>
        <NavItems uri={uri} items={items} basePath={basePath} />
      </Collapse>
    </div>
  );
}

NavGroup.propTypes = {
  uri: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  items: PropTypes.object.isRequired,
  basePath: PropTypes.string
};

function NavItems({items, uri, basePath}) {
  const activeColor = useColorModeValue('indigo.500', 'indigo.200');
  return Object.entries(items).map(([key, value], index) => {
    if (typeof value === 'string') {
      const path = join('/', basePath || '', value);
      const isActive = !relative(path, uri);
      return (
        <div key={index}>
          <Link as={GatsbyLink} to={path} color={isActive && activeColor}>
            {key}
          </Link>
        </div>
      );
    }
    return (
      <NavGroup
        uri={uri}
        key={index}
        label={key}
        items={value}
        basePath={basePath}
      />
    );
  });
}

NavItems.propTypes = {
  uri: PropTypes.string.isRequired,
  items: PropTypes.object.isRequired,
  basePath: PropTypes.string
};

export default function PageTemplate({data, uri, pageContext}) {
  const {gitRemote, childMdx, childMarkdownRemark} = data.file;
  const {frontmatter} = childMdx || childMarkdownRemark;
  const {title, description} = frontmatter;
  const {sidebar} = pageContext;
  return (
    <Layout>
      <Helmet title={title} />
      <Grid templateColumns="300px 1fr">
        <chakra.aside>
          {sidebar && (
            <chakra.nav>
              <NavItems
                uri={uri}
                items={sidebar}
                basePath={gitRemote?.sourceInstanceName}
              />
            </chakra.nav>
          )}
        </chakra.aside>
        <Box px="10" py="12" as="main">
          <Heading size="2xl">{title}</Heading>
          {description && (
            <Heading mt="2" size="lg" fontWeight="medium">
              {description}
            </Heading>
          )}
          <Divider my="8" />
          <PathContext.Provider
            value={data.file.name === 'index' ? uri : dirname(uri)}
          >
            {childMdx ? (
              <MDXProvider components={mdxComponents}>
                <MDXRenderer>{childMdx.body}</MDXRenderer>
              </MDXProvider>
            ) : (
              <Wrapper>{renderAst(childMarkdownRemark.htmlAst)}</Wrapper>
            )}
          </PathContext.Provider>
        </Box>
      </Grid>
    </Layout>
  );
}

PageTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  uri: PropTypes.string.isRequired,
  pageContext: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  query GetPage($id: String!) {
    file(id: {eq: $id}) {
      name
      gitRemote {
        sourceInstanceName
      }
      childMdx {
        body
        frontmatter {
          title
          description
        }
      }
      childMarkdownRemark {
        htmlAst
        frontmatter {
          title
          description
        }
      }
    }
  }
`;
