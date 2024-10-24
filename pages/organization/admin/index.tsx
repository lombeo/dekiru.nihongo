import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import OrganizationAdmin from "@src/modules/organization/OrganizationAdmin";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const OrganizationAdminPage = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray>
        <OrganizationAdmin />
      </DefaultLayout>
    </>
  );
};

export default OrganizationAdminPage;
