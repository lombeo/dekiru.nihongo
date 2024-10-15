import DefaultLayout from "@src/components/Layout/Layout";
import MentorSetting from "@src/modules/mentor/MentorSetting";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const MentorSettingPage: NextPage = () => {
  return (
    <DefaultLayout bgGray>
      <MentorSetting />
    </DefaultLayout>
  );
};

export default MentorSettingPage;
