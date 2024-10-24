import Head from "next/head";

const HeadSEO = ({
  title = "",
  description = "CodeLearn is an online platform developed by FPT Software company that helps users to learn, practice coding skills and join the developer community",
  ogImage = "https://scale.codelearn.io/images/codelearn-banner.jpeg",
  children = <></>,
}) => {
  return (
    <Head>
      <title>{title ? title + " | CodeLearn" : "CodeLearn"}</title>
      <link rel="icon" href="/favicon.png" sizes="any" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1,user-scalable=0" />
      <meta
        name="google-signin-client_id"
        content="16523143533-ovv9lj8c7i8sv36sv3lguom0msmdk8ah.apps.googleusercontent.com"
      />
      <meta name="description" content={description} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:site" content="@Codelearn.io" />
      <meta name="twitter:creator" content="@Codelearn.io" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="fb:app_id" content="540883753774783" />
      {children}
    </Head>
  );
};

export default HeadSEO;
