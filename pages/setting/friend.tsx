import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import FriendSetting from "@src/modules/setting/friend/FriendSetting";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const FriendSettingPage: NextPage = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray>
        <FriendSetting />
      </DefaultLayout>
    </>
  );
};

export default FriendSettingPage;
