import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import DefaultLayout from "@src/components/Layout/Layout";
import MentorIndex from "@src/modules/mentor/MentorIndex/MentorIndex";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const MentorPage: NextPage = () => {
  return (
    <DefaultLayout bgGray allowAnonymous>
      <MentorIndex />
    </DefaultLayout>
  );
};

export default MentorPage;
