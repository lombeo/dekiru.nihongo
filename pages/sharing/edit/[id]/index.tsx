import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import SharingEditIndex from "@src/modules/sharing/SharingEdit/SharingEditIndex";
import { GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const SharingEditIndexPage = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray>
        <SharingEditIndex />
      </DefaultLayout>
    </>
  );
};
export const getStaticPaths: GetStaticPaths<{
  activityId: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
export default SharingEditIndexPage;
