export default function Seo({ post }) {
  const { title, excerpt, slug, coverImage, link } = post;
  return (
    <>
      {/*<NextSeo*/}
      {/*  title={title}*/}
      {/*  description={excerpt}*/}
      {/*  // canonical={`https://mywebsite.com/blog/${slug}`}*/}
      {/*  canonical={link}*/}
      {/*  openGraph={{*/}
      {/*    type: "website",*/}
      {/*    url: link,*/}
      {/*    title: `${title}`,*/}
      {/*    description: excerpt,*/}
      {/*    locale: "en_EN",*/}
      {/*    images: [*/}
      {/*      {*/}
      {/*        url: coverImage,*/}
      {/*        width: 800,*/}
      {/*        height: 600,*/}
      {/*        alt: `image for ${title}`,*/}
      {/*      },*/}
      {/*    ],*/}
      {/*    site_name: "codelearn.io",*/}
      {/*  }}*/}
      {/*  twitter={{*/}
      {/*    handle: "@codelearn",*/}
      {/*    site: "codelearn.io",*/}
      {/*    cardType: "summary_large_image",*/}
      {/*  }}*/}
      {/*/>*/}
    </>
  );
}
