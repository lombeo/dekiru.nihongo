import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import OrganizationIndex from "@src/modules/organization/OrganizationIndex";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Page = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray>
        <OrganizationIndex />
      </DefaultLayout>
    </>
  );
};

export default Page;
