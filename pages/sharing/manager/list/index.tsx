import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import SharingListIndex from "@src/modules/sharing/SharingManager/SharingListIndex";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const SharingIndexPage = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray>
        <SharingListIndex />
      </DefaultLayout>
    </>
  );
};

export default SharingIndexPage;
