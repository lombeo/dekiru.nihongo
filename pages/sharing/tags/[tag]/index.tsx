import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths } from "next";
import TagsSharingIndex from "@src/modules/sharing/TagsSharing/TagsSharingIndex";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const TagsSharingIndexPage = () => {
  return (
    <DefaultLayout bgGray allowAnonymous>
      <TagsSharingIndex />
    </DefaultLayout>
  );
};
export const getStaticPaths: GetStaticPaths<{
  activityId: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
export default TagsSharingIndexPage;
