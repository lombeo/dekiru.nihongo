import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import LearningIndex from "@src/modules/learning/LearningIndex/LearningIndex";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
const LearningIndexPage = (props: any) => {
  const {t} = useTranslation();
  return (
    <>
      <HeadSEO title={t("Learning")} />
      <DefaultLayout bgGray allowAnonymous>
        <LearningIndex />
      </DefaultLayout>
    </>
  );
};
export default LearningIndexPage;
