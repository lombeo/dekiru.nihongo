import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import SchoolIndex from "@src/modules/setting/school";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const SchoolPage: NextPage = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray>
        <SchoolIndex />
      </DefaultLayout>
    </>
  );
};

export default SchoolPage;
