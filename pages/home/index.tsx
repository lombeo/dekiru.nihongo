import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import HomeIndex from "@src/modules/home/HomeIndex";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Page = () => {
  const { t } = useTranslation();
  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray allowAnonymous>
        <HomeIndex />
      </DefaultLayout>
    </>
  );
};

export default Page;
