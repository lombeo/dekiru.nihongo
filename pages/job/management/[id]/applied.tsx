import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths } from "next";
import ListApplied from "@src/modules/job/ListApplied/ListApplied";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Page = () => {
  return (
    <DefaultLayout bgGray>
      <ListApplied />
    </DefaultLayout>
  );
};

export default Page;

export const getStaticPaths: GetStaticPaths<{
  id: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
