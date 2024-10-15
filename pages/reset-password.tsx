import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { logout } from "@src/helpers/helper";
import ResetPasswordIndex from "@src/modules/reset-password/ResetPasswordIndex";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Page = () => {
  useEffect(() => {
    logout();
  }, []);

  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray allowAnonymous>
        <ResetPasswordIndex />
      </DefaultLayout>
    </>
  );
};

export default Page;
