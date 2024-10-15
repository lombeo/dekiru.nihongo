import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import ListClassAdminIndex from "@src/modules/classmanagement/ListClassAdmin/ListClassAdminIndex";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const ListClassAdminPage = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray>
        <ListClassAdminIndex />
      </DefaultLayout>
    </>
  );
};

export default ListClassAdminPage;
