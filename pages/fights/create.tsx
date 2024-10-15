import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import FightCreate from "@src/modules/fights/FightCreate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const FightCreatePage = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray>
        <FightCreate />
      </DefaultLayout>
    </>
  );
};

export default FightCreatePage;
