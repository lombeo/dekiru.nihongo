import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import HelpManager from "@src/modules/help/HelpManager";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const HelpManagerPage = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray>
        <HelpManager />
      </DefaultLayout>
    </>
  );
};

export default HelpManagerPage;
