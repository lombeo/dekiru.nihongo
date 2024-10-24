import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import ChallengeEdit from "@src/modules/challenge/ChallengeEdit";
import { GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Page = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray>
        <ChallengeEdit />
      </DefaultLayout>
    </>
  );
};

export default Page;

export const getStaticPaths: GetStaticPaths<{
  permalink: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
