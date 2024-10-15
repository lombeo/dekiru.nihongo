import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import Profile from "@src/modules/profile/Profile";
import { GetStaticPaths } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const ProfilePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeadSEO title={t("Profile")} />
      <DefaultLayout bgGray allowAnonymous>
        <Profile />
      </DefaultLayout>
    </>
  );
};

export default ProfilePage;

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
