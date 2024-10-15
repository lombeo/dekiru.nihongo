import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import AvatarSetting from "@src/modules/setting/avatar/AvatarSetting";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
const Page: NextPage = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray>
        <AvatarSetting />
      </DefaultLayout>
    </>
  );
};

export default Page;
