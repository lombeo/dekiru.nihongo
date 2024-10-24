import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import FriendView from "@src/modules/friend/FriendView";
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

const FriendPage: NextPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <HeadSEO title={t("Friends")} />
      <DefaultLayout bgGray>
        <FriendView />
      </DefaultLayout>
    </>
  );
};

export default FriendPage;
