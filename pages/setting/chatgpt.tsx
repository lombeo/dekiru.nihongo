import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import ChatGPTSetting from "@src/modules/chatgpt/setting";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
const ChatGptSettingPage: NextPage = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray>
        <ChatGPTSetting />
      </DefaultLayout>
    </>
  );
};

export default ChatGptSettingPage;
