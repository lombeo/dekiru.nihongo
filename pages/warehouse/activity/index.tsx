import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import WarehouseActivity from "@src/modules/warehouse/WarehouseActivity";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const WarehouseActivityPage = () => {
  return (
    <DefaultLayout hiddenFooter>
      <WarehouseActivity />
    </DefaultLayout>
  );
};

export default WarehouseActivityPage;
