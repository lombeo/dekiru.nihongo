import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import Reports from "@src/modules/reports";
import { GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const ReportPage = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout full>
        <Reports />
      </DefaultLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths<{ type: string }> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
export default ReportPage;
