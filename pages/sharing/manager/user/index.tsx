import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import ManagerUser from "@src/modules/sharing/ManagerUser/ManagerUser";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const ManagerUserPage = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray>
        <ManagerUser />
      </DefaultLayout>
    </>
  );
};

export default ManagerUserPage;
