/** @jsx jsx */
import { FunctionComponent } from 'react'
import { Helmet } from 'react-helmet'
import { MDXProvider } from '@mdx-js/react'
import { graphql, withPrefix } from 'gatsby'
import { useFlags } from 'gatsby-plugin-launchdarkly'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import pluralize from 'pluralize'
import { Card, jsx, ThemeProvider } from 'theme-ui'

import { SiteFrontmatter } from '../types/siteType'

import Homepage from './home/landingPage'
import ClientSideSdks from './home/sdks/clientSideSdks'
import { AllSdks } from './home/sdks/exploreSdks'
import ReactSdks from './home/sdks/reactSdks'
import ServerSideSdks from './home/sdks/serverSideSdks'
import Callout, { CalloutDescription, CalloutTitle } from './mdx/callout'
import { Code, CodeTabItem, CodeTabs } from './mdx/code'
import Details from './mdx/details'
import Feature from './mdx/feature'
import Figure, { FigCaption } from './mdx/figure'
import { H1, H2, H3, H4, H5, H6 } from './mdx/heading'
import LearnMore from './mdx/learnMore'
import MdxHeader from './mdx/mdxHeader'
import Metadata from './mdx/metadata'
import Pre from './mdx/pre'
import Table, { TableBody, TableCell, TableHeadCell, TableHeader, TableRow } from './mdx/table'
import DesktopSideNav from './sideNav/desktopSideNav'
import ChildPageList from './ChildPageList'
import { RelayEndOfLife, SdksEndOfLife } from './endOfLife'
import Header from './header'
import Icon from './icon'
import Link from './link'
import Reset from './resetStyles'
import { TableOfContents, TOC } from './tableOfContents'

const components = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  a: Link,
  figure: Figure,
  figcaption: FigCaption,
  Card,
  Metadata,
  Table,
  TableHeader,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  Callout,
  CalloutTitle,
  CalloutDescription,
  LearnMore,
  Link,
  CodeTabs,
  CodeTabItem,
  Homepage,
  AllSdks,
  ClientSideSdks,
  ServerSideSdks,
  ReactSdks,
  SdksEndOfLife,
  RelayEndOfLife,
  Icon,
  code: Code,
  inlineCode: Code,
  pre: Pre,
  ChildPageList,
  Feature,
  Details,
}

const theme = {}

const rootGridStyles = {
  letterSpacing: '0.0125rem',
  color: 'text',
  height: '100vh',
  display: 'grid',
  gridTemplateColumns: ['100%', '19rem auto', '19rem 48rem auto'],
  gridTemplateRows: '4.5rem auto',
  gridTemplateAreas: [
    `
            'header'
            'main'
            'footer'
            `,
    `
            'header header'
            'sideNav main'
            'sideNav footer'
            `,
    `
            'header header header'
            'sideNav main aside'
            'sideNav footer footer'
            `,
  ],
}

interface LayoutProps {
  data: {
    site: {
      siteMetadata: {
        title: string
        siteUrl: string
      }
    }
    mdx: {
      body: string
      toc: TOC
      timeToRead: number
      fields: {
        isLandingPage: boolean
        lastModifiedTime: string
        modifiedDate: string
      }
      frontmatter: {
        title: string
        description: string
        path: string
        site: SiteFrontmatter
        siteAlertTitle: string
      }
      fileAbsolutePath: string
    }
  }
}

const Layout: FunctionComponent<LayoutProps> = ({
  data: {
    site: {
      siteMetadata: { title: siteTitle, siteUrl },
    },
    mdx: {
      body,
      toc,
      timeToRead,
      fields: { isLandingPage, lastModifiedTime, modifiedDate },
      frontmatter: { title, description, path, site = 'all', siteAlertTitle },
      fileAbsolutePath,
    },
  },
}) => {
  const { enableUserWayAccessibilityWidget } = useFlags()
  return (
    <ThemeProvider theme={theme}>
      <Reset />
      <Helmet
        defer={false}
        htmlAttributes={{ lang: 'en' }}
        title={title}
        meta={[
          { name: 'description', content: description },
          // Open Graph
          { name: 'og:site_name', content: siteTitle },
          { name: 'og:url', content: `${siteUrl}${withPrefix(path)}` },
          { name: 'og:title', content: title },
          { name: 'og:description', content: description },
          { name: 'og:type', content: 'article' },
          { name: 'article:modified_time', content: lastModifiedTime },
          // Twitter
          { name: 'twitter:domain', content: `${siteUrl.replace('https://', '').replace('http://', '')}` },
          { name: 'twitter:title', content: title },
          { name: 'twitter:description', content: description },
          { name: 'twitter:label1', content: 'Read time' },
          { name: 'twitter:data1', content: `${timeToRead} ${pluralize('minute', timeToRead)} ` },
          { name: 'twitter:label2', content: 'Last edited' },
          { name: 'twitter:data2', content: `${modifiedDate}` },
        ]}
      >
        {enableUserWayAccessibilityWidget && (
          <script defer>
            {
              '(function(d){var s = d.createElement("script");s.setAttribute("data-account", "8Vh97O4fZ4");s.setAttribute("src", "https://cdn.userway.org/widget.js");(d.body || d.head).appendChild(s);})(document)'
            }
          </script>
        )}
      </Helmet>
      <div sx={rootGridStyles}>
        <Header />
        <DesktopSideNav />

        <main sx={{ gridArea: 'main', px: [5, 7, 8], pt: '2.75rem' }}>
          <article>
            <MdxHeader
              fileAbsolutePath={fileAbsolutePath}
              title={title}
              timeToRead={timeToRead}
              lastModifiedDateFormatted={modifiedDate}
              isLandingPage={isLandingPage}
              site={site}
              siteAlertTitle={siteAlertTitle}
            />
            <MDXProvider components={components}>
              <MDXRenderer>{body}</MDXRenderer>
            </MDXProvider>
          </article>
        </main>
        {!isLandingPage && (
          <aside sx={{ gridArea: 'aside', pt: 4, display: ['none', 'none', 'block'], width: '18rem' }}>
            <TableOfContents toc={toc} />
          </aside>
        )}
        <footer sx={{ gridArea: 'footer', height: '7rem' }}></footer>
      </div>
    </ThemeProvider>
  )
}

export const pageQuery = graphql`
  query Query($id: String) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    mdx(id: { eq: $id }, frontmatter: { published: { eq: true } }) {
      body
      toc: tableOfContents(maxDepth: 2)
      timeToRead
      fields {
        isLandingPage
        lastModifiedTime(formatString: "MMM DD, YYYY")
        modifiedDate: lastModifiedTime(formatString: "MMM DD, YYYY")
      }
      frontmatter {
        title
        description
        path
        site
        siteAlertTitle
      }
      fileAbsolutePath
    }
  }
`

export default Layout
