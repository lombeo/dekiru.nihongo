import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import DiscussionDetailIndex from "@src/modules/discussion/DiscussionDetail/DiscussionDetailIndex";
import { GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const TopicEditPage = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout allowAnonymous>
        <DiscussionDetailIndex />
      </DefaultLayout>
    </>
  );
};

export default TopicEditPage;

export const getStaticPaths: GetStaticPaths<{
  id: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
