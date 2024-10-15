import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ClassManagementIndex from "@src/modules/classmanagement/ClassManagementIndex";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const ClassMamanagementIndexPage = () => {
  return (
    <DefaultLayout bgGray>
      <ClassManagementIndex />
    </DefaultLayout>
  );
};

export default ClassMamanagementIndexPage;
