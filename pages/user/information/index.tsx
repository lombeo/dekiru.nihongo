import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import UserInformation from "@src/modules/user/UserInformation/UserInformation";
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
      <HeadSEO title={t("My information")} />
      <DefaultLayout bgGray>
        <UserInformation />
      </DefaultLayout>
    </>
  );
};

export default Page;
