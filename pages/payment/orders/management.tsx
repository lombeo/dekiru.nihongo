import { Breadcrumbs } from "@edn/components";
import { Container } from "@src/components";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { OrdersContextProvider } from "@src/modules/orders/components/OrdersContextProvider";
import OrderListHistory from "@src/modules/orders/OrderListHistory";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ locale, query }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      query: query,
    },
  };
}

const OrderListHistoryPage: NextPage = (props: any) => {
  const { t } = useTranslation();
  return (
    <>
      <HeadSEO title={t("Orders")} />
      <DefaultLayout bgGray>
        <Container size="xl">
          <div className="w-full max-w-[1200px] m-auto">
            <Breadcrumbs
              data={[
                {
                  href: "/",
                  title: t("Home"),
                },
                {
                  title: t("Orders"),
                },
              ]}
            />
          </div>
          <div className="py-3">
            <OrdersContextProvider query={props.query}>
              <OrderListHistory isAdmin={true} />
            </OrdersContextProvider>
          </div>
        </Container>
      </DefaultLayout>
    </>
  );
};

export default OrderListHistoryPage;
