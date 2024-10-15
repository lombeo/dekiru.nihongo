import DefaultLayout from "@src/components/Layout/Layout";
import React, { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths } from "next";
import FormJob from "@src/modules/job/FormJob";
import { RecruitmentService } from "@src/services/RecruitmentService";
import { Notify } from "@edn/components/Notify/AppNotification";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import useIsManagerRecruitment from "@src/hooks/useIsManagerRecruitment";

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
      <WrapFormJob />
    </DefaultLayout>
  );
};

export default Page;

const WrapFormJob = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const id = router.query.id;

  const { isManager, loading } = useIsManagerRecruitment();

  const [data, setData] = useState(null);

  const fetch = async () => {
    const res = await RecruitmentService.jobGetDetailById(id);
    if (res?.data?.success) {
      setData(res?.data?.data);
    } else if (res.data?.message) {
      Notify.error(t(res.data?.message));
    }
  };
  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (!loading && !isManager) {
      router.push("/403");
    }
  }, [isManager, loading]);

  if (loading || !isManager) return null;

  return <> {data ? <FormJob isUpdate data={data} /> : null}</>;
};

export const getStaticPaths: GetStaticPaths<{
  id: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
