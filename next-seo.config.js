import nextConfig from "next.config";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: nextConfig.domain,
    title: "CodeLearn",
    description: "Social Constructive Learning Platform",
    images: [
      {
        url: `/codelearn-share.jpeg`,
        width: 980,
        height: 513,
        alt: "Social Constructive Learning Platform",
        type: "image/jpeg",
      },
    ],
    site_name: "CodeLearn",
  },
  twitter: {
    handle: "@fpt",
    site: "@CodeLearn.io",
    cardType: "summary_large_image",
  },
  additionalLinkTags: [
    {
      rel: "icon",
      href: `/favico.png`,
      sizes: "32x32",
    },
    {
      rel: "apple-touch-icon",
      href: `/favico.png`,
      sizes: "32x32",
    },
    {
      rel: "manifest",
      href: `/site.webmanifest`,
    },
  ],
};
