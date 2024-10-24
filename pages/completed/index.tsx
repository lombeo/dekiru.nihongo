import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import CompletedListIndex from "@src/modules/completed-list/CompletedListIndex";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const CompletedListIndexPage = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray allowAnonymous>
        <CompletedListIndex />
      </DefaultLayout>
    </>
  );
};
export default CompletedListIndexPage;
