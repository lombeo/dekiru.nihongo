import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import OrderDetail from "@src/modules/order-detail/OrderDetail";
import { GetStaticPaths, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export const getStaticPaths: GetStaticPaths<{
  orderId: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const ResultsPage: NextPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <HeadSEO title={t("Order")} />
      <DefaultLayout>
        <OrderDetail />
      </DefaultLayout>
    </>
  );
};

export default ResultsPage;
