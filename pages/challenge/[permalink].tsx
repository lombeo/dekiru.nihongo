import Activity from "@src/components/Activity";
import ActivityContextProvider from "@src/components/Activity/context";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { useNextQueryParam } from "@src/helpers/query-utils";
import ChallengeDetail from "@src/modules/challenge/ChallengeDetail";
import { ActivityContextType } from "@src/services/Coding/types";
import { GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
const ChallengeDetailPage = () => {
  const activityId = useNextQueryParam("activityId");

  if (activityId) {
    return (
      <>
        <HeadSEO />
        <DefaultLayout hiddenFooter allowAnonymous hiddenChat>
          <ActivityContextProvider contextType={ActivityContextType.Challenge}>
            <Activity />
          </ActivityContextProvider>
        </DefaultLayout>
      </>
    );
  }

  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray allowAnonymous>
        <ChallengeDetail />
      </DefaultLayout>
    </>
  );
};

export default ChallengeDetailPage;

export const getStaticPaths: GetStaticPaths<{
  permalink: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
