import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import TeamIndex from "@src/modules/team/TeamIndex";
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

const TeamPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeadSEO title={t("Team")} />
      <DefaultLayout bgGray>
        <TeamIndex />
      </DefaultLayout>
    </>
  );
};

export default TeamPage;
