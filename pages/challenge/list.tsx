import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import ChallengeOtherList from "@src/modules/challenge/ChallengeOtherList";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const ChallengeListPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeadSEO title={t("Challenge")} />
      <DefaultLayout bgGray allowAnonymous>
        <ChallengeOtherList />
      </DefaultLayout>
    </>
  );
};

export default ChallengeListPage;
