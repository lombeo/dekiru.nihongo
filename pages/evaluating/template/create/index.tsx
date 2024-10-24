import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import EvaluatingTemplateCreate from "@src/modules/evaluating/EvaluatingTemplateCreate";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const EvaluatingTemplateCreatePage = () => {
  return (
    <DefaultLayout bgGray>
      <EvaluatingTemplateCreate />
    </DefaultLayout>
  );
};

export default EvaluatingTemplateCreatePage;
