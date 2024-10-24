import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths } from "next";
import MentorDetail from "@src/modules/mentor/MentorDetail";
import DefaultLayout from "@src/components/Layout/Layout";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export const getStaticPaths: GetStaticPaths<{
  id: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const MentorDetailPage = (props: any) => {
  return (
    <DefaultLayout bgGray>
      <MentorDetail />
    </DefaultLayout>
  );
};

export default MentorDetailPage;
