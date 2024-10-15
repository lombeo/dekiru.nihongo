import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import EvaluatingAdmin from "@src/modules/evaluating/EvaluatingAdmin";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const EvaluatingAdminPage = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray>
        <EvaluatingAdmin />
      </DefaultLayout>
    </>
  );
};

export default EvaluatingAdminPage;
