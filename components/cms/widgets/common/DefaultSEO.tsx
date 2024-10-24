import nextConfig from "next.config";

const DefaultSEO = ({
  title = "Dekiru CMS",
  description = "Social Constructive Learning Platform",
  ogType = "website",
}) => {
  return (
    <>
      <meta name="description" content={description} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@handle" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="Dekiru CMS" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:image"
        content={`${nextConfig.basePath}/edn-thumb-1-1.png`}
      />
      <meta property="og:type" content="website" />
      <meta
        property="og:image:alt"
        content="Social Constructive Learning Platform"
      />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="300" />
      <meta property="og:image:height" content="300" />
      <meta
        property="og:image"
        content={`${nextConfig.basePath}/edn-thumb-4-3.png`}
      />
      <meta
        property="og:image:alt"
        content="Social Constructive Learning Platform"
      />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="300" />
    </>
  );
};

export default DefaultSEO;
