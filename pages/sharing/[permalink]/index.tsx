import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { CDN_URL, SHARING_API } from "@src/config";
import SharingDetail from "@src/modules/sharing/SharingDetail";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

export async function getStaticProps({ locale, params }: any) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["gets"],
    queryFn: async () => {
      const res = await axios.get(SHARING_API + `/blog/detail`, {
        params: {
          permalink: params.permalink,
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

const SharingDetailPage = ({ dehydratedState }) => {
  const router = useRouter();
  const { data, refetch } = useQuery({
    queryKey: ["gets"],
    queryFn: async () => {
      const res = await axios.get(SHARING_API + `/blog/detail`, {
        params: {
          permalink: router.query.permalink,
        },
      });
      return res.data.data;
    },
    initialData: dehydratedState.queries[0]?.state?.data,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <>
      <HeadSEO
        title={data?.title}
        description={data?.description}
        ogImage={data?.imageUrl?.startsWith("http") ? data?.imageUrl : CDN_URL + data?.imageUrl}
      />
      <DefaultLayout bgGray allowAnonymous>
        <SharingDetail data={data} refetch={refetch} />
      </DefaultLayout>
    </>
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

export default SharingDetailPage;
