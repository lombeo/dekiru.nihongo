import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import ReleaseView from "@src/modules/release/ReleaseView";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
const ReleaseCoursePage: NextPage = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout>
        <ReleaseView />
      </DefaultLayout>
    </>
  );
};

export default ReleaseCoursePage;
