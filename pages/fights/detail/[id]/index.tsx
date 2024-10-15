import Activity from "@src/components/Activity/Activity";
import ShareScratch from "@src/components/Activity/components/ShareScratch";
import ActivityContextProvider from "@src/components/Activity/context";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { CDN_URL, CODING_API } from "@src/config";
import { useNextQueryParam } from "@src/helpers/query-utils";
import FightDetail from "@src/modules/fights/FightDetail";
import { ActivityContextType } from "@src/services/Coding/types";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import axios from "axios";
import { GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale, params }: any) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["getActivity"],
    queryFn: async () => {
      const res = await axios.get(CODING_API + "/coding/contest/details", {
        params: {
          contestId: params.id,
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

const FightDetailPage = ({ dehydratedState }) => {
  const activityId = useNextQueryParam("activityId");
  const activityType = useNextQueryParam("activityType");
  const shareId = useNextQueryParam("shareId");

  // const { data } = useQuery({
  //   queryKey: ["getActivity"],
  //   queryFn: async () => {
  //     const res = await axios.get(CODING_API + "/coding/contest/details", {
  //       params: {
  //         permalink: router.query.id,
  //       },
  //     });
  //     return res.data.data;
  //   },
  //   initialData: dehydratedState.queries[0]?.state?.data,
  //   staleTime: 5 * 60 * 1000,
  // });

  const data = dehydratedState?.queries[0]?.state?.data;

  const ogImage = data?.imagePoster?.startsWith("http") ? data?.imagePoster : CDN_URL + data?.imagePoster;

  if (activityId && activityType && shareId)
    return (
      <>
        <HeadSEO title={data?.title} description={data?.description} ogImage={ogImage} />
        <DefaultLayout hiddenFooter allowAnonymous hiddenChat>
          <ShareScratch />
        </DefaultLayout>
      </>
    );

  if (activityId) {
    return (
      <>
        <HeadSEO title={data?.title} description={data?.description} ogImage={ogImage} />
        <DefaultLayout hiddenFooter allowAnonymous hiddenChat>
          <ActivityContextProvider contextType={ActivityContextType.Contest}>
            <Activity />
          </ActivityContextProvider>
        </DefaultLayout>
      </>
    );
  }

  return (
    <>
      <HeadSEO title={data?.title} description={data?.description} ogImage={ogImage} />
      <DefaultLayout bgGray allowAnonymous>
        <FightDetail />
      </DefaultLayout>
    </>
  );
};

export default FightDetailPage;

export const getStaticPaths: GetStaticPaths<{
  id: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
