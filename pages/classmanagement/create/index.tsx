import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ClassCreateIndex from "@src/modules/classmanagement/ClassCreate";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const ClassCreatePage = () => {
  return (
    <DefaultLayout>
      <ClassCreateIndex />
    </DefaultLayout>
  );
};

export default ClassCreatePage;
