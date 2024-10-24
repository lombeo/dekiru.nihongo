import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import ChallengeCreate from "@src/modules/challenge/ChallengeCreate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const ChallengeCreatePage = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray>
        <ChallengeCreate />
      </DefaultLayout>
    </>
  );
};

export default ChallengeCreatePage;
