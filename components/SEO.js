import Head from 'next/head'
import { useRouter } from 'next/router'
import siteMetadata from '@/data/siteMetadata'

const CommonSEO = ({ title, description, keywords, ogType, ogImage }) => {
  const router = useRouter()
  return (
    <Head>
      <title>{title}</title>
      <meta name="robots" content="follow, index" />
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content={`funatic, maths, mathematics, tutor, tutoring, teacher, teaching, funatic maths, south africa, cape town, education, mathematics resources, help, guidance, ${keywords}`}
      />
      <meta property="og:url" content={`${siteMetadata.siteUrl}${router.asPath}`} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteMetadata.title} />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      {ogImage.constructor.name === 'Array' ? (
        ogImage.map(({ url }) => <meta property="og:image" content={url} key={url} />)
      ) : (
        <meta property="og:image" content={ogImage} key={ogImage} />
      )}
    </Head>
  )
}

export const PageSEO = ({ title, description, keywords }) => {
  const ogImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner
  return (
    <CommonSEO
      title={title}
      description={description}
      keywords={keywords}
      ogType="website"
      ogImage={ogImageUrl}
    />
  )
}

export const TagSEO = ({ title, description, keywords }) => {
  const ogImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner
  const router = useRouter()
  return (
    <>
      <CommonSEO title={title} description={description} ogType="website" ogImage={ogImageUrl} />
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${description} - RSS feed`}
          href={`${siteMetadata.siteUrl}/${router.asPath}/feed.xml`}
        />
      </Head>
    </>
  )
}

export const ExamSEO = ({
  authorDetails,
  title,
  description,
  date,
  lastmod,
  url,
  images = [],
  keywords,
}) => {
  const router = useRouter()
  const publishedAt = new Date(date).toISOString()
  const modifiedAt = new Date(lastmod || date).toISOString()
  let imagesArr =
    images.length === 0
      ? [siteMetadata.socialBanner]
      : typeof images === 'string'
      ? [images]
      : images

  const featuredImages = imagesArr.map((img) => {
    return {
      '@type': 'ImageObject',
      url: img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })

  let authorList
  if (authorDetails) {
    authorList = authorDetails.map((author) => {
      return {
        '@type': 'Person',
        name: author.name,
      }
    })
  } else {
    authorList = {
      '@type': 'Person',
      name: siteMetadata.author,
    }
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    image: featuredImages,
    datePublished: publishedAt,
    dateModified: modifiedAt,
    author: authorList,
    publisher: {
      '@type': 'Organization',
      name: siteMetadata.author,
      logo: {
        '@type': 'ImageObject',
        url: `${siteMetadata.siteUrl}${siteMetadata.siteLogo}`,
      },
    },
    description: description,
  }

  return (
    <>
      <CommonSEO
        title={title}
        description={description}
        keywords={keywords}
        ogType="article"
        ogImage={featuredImages}
      />
      <Head>
        {date && <meta property="article:published_time" content={publishedAt} />}
        {lastmod && <meta property="article:modified_time" content={modifiedAt} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData, null, 2),
          }}
        />
      </Head>
    </>
  )
}

export const TutorSEO = ({ title, description, images = [], keywords }) => {
  let imagesArr =
    images.length === 0
      ? [siteMetadata.socialBanner]
      : typeof images === 'string'
      ? [images]
      : images

  const featuredImages = imagesArr.map((img) => {
    return {
      '@type': 'ImageObject',
      url: img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })

  return (
    <CommonSEO
      title={title}
      description={description}
      keywords={keywords}
      ogType="profile"
      ogImage={featuredImages}
    />
  )
}
