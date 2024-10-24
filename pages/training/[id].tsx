import Activity from "@src/components/Activity";
import ActivityContextProvider from "@src/components/Activity/context";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { CODING_API } from "@src/config";
import { ActivityContextType } from "@src/services/Coding/types";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import axios from "axios";
import DOMPurify from "dompurify";
import { GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
//import { JSDOM } from "jsdom";

export async function getStaticProps({ locale, params }: any) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["getActivityDetail"],
    queryFn: async () => {
      const res = await axios.get(CODING_API + "/coding/training/get-code-activity", {
        params: {
          activityId: params.id,
          contextId: params.id,
          contextType: ActivityContextType.Training,
        },
      });
      return res.data.data;
    },
  });
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      dehydratedState: dehydrate(queryClient),
    },
  };
}
const TrainingDetailPage = ({ dehydratedState }) => {
  const router = useRouter();
  const { data, refetch } = useQuery({
    queryKey: ["getActivityDetail"],
    queryFn: async () => {
      const res = await axios.get(CODING_API + "/coding/training/get-code-activity", {
        params: {
          activityId: router.query.id,
          contextId: router.query.id,
          contextType: ActivityContextType.Training,
        },
      });
      return res.data.data;
    },
    initialData: dehydratedState?.queries[0]?.state?.data,
    staleTime: 5 * 60 * 1000,
  });
  return (
    <>
      <HeadSEO title={data.codeActivity.activity.title} />
      <DefaultLayout hiddenFooter allowAnonymous hiddenChat>
        <ActivityContextProvider contextType={ActivityContextType.Training}>
          <Activity />
        </ActivityContextProvider>
      </DefaultLayout>
    </>
  );
};

export default TrainingDetailPage;

export const getStaticPaths: GetStaticPaths<{
  activityId: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
