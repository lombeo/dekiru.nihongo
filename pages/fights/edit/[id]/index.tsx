import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import FightEdit from "@src/modules/fights/FightEdit";
import { GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const FightEditPage = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray>
        <FightEdit />
      </DefaultLayout>
    </>
  );
};

export default FightEditPage;

export const getStaticPaths: GetStaticPaths<{
  id: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
