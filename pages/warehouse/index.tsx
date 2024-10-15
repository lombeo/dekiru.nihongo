import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import EvaluatingIndex from "@src/modules/evaluating/EvaluatingIndex";
import WarehourseIndex from "@src/modules/warehouse/WarehouseIndex/WarehouseIndex";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const WarehourseIndexPage = () => {
  return (
    <DefaultLayout bgGray>
      <WarehourseIndex />
    </DefaultLayout>
  );
};

export default WarehourseIndexPage;
