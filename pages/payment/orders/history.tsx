import React from "react";
import { Breadcrumbs } from "@edn/components";
import { Container } from "@src/components";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import OrderListHistory from "@src/modules/orders/OrderListHistory";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { OrdersContextProvider } from "@src/modules/orders/components/OrdersContextProvider";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const MyOrderPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeadSEO />
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
            <OrdersContextProvider>
              <OrderListHistory isAdmin={false} />
            </OrdersContextProvider>
          </div>
        </Container>
      </DefaultLayout>
    </>
  );
};

export default MyOrderPage;
