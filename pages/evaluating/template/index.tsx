import DefaultLayout from "@src/components/Layout/Layout";
import EvaluatingTemplate from "@src/modules/evaluating/EvaluatingTemplate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const EvaluatingTemplatePage = () => {
  return (
    <DefaultLayout bgGray>
      <EvaluatingTemplate />
    </DefaultLayout>
  );
};

export default EvaluatingTemplatePage;
