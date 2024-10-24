import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import HelpIndex from "@src/modules/help/HelpIndex";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const HelpIndexPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <HeadSEO
        title={t("Frequently asked questions on CodeLearn")}
        description={t(
          "The set of answers and information about frequent questions or concerns such as personal information, programming courses, coding contest, etc."
        )}
      />
      <DefaultLayout bgGray allowAnonymous>
        <HelpIndex />
      </DefaultLayout>
    </>
  );
};

export default HelpIndexPage;
