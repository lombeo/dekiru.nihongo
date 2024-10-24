import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import CampaignSales from "@src/modules/sales/CampainSales";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Page = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray>
        <CampaignSales />
      </DefaultLayout>
    </>
  );
};

export default Page;
