import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import CategoryManage from "@src/modules/cms/categories";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "category"])),
      // Will be passed to the page component as props
    },
  };
}

const Page: NextPage = () => {
  return (
    <>
      <HeadSEO title={"CMS"} />
      <DefaultLayout>
        <CategoryManage />
      </DefaultLayout>
    </>
  );
};

export default Page;
