import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import ListUser from "@src/modules/user/ListUser";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Page: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeadSEO title={t("List users")} />
      <DefaultLayout bgGray>
        <ListUser />
      </DefaultLayout>
    </>
  );
};

export default Page;
