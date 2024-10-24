import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths } from "next";
import SharingByUserIndex from "@src/modules/sharing/SharingByUser/SharingByUserIndex";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const PostByUserSharingIndexPage = () => {
  return (
    <DefaultLayout bgGray allowAnonymous>
      <SharingByUserIndex />
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
export default PostByUserSharingIndexPage;
