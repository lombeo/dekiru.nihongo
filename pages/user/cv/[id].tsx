import DefaultLayout from "@src/components/Layout/Layout";
import React, { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths } from "next";
import { RecruitmentService } from "@src/services/RecruitmentService";
import { Notify } from "@edn/components/Notify/AppNotification";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import FormCv from "@src/modules/user/FormCv";

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
      <WrapForm />
    </DefaultLayout>
  );
};

export default Page;

const WrapForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const id = router.query.id;

  const [data, setData] = useState(null);

  const fetch = async () => {
    const res = await RecruitmentService.cvGetDetailById(id);
    if (res?.data?.success) {
      setData(res?.data?.data);
    } else if (res?.data?.message) {
      Notify.error(t(res.data?.message));
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return <> {data ? <FormCv isUpdate data={data} /> : null}</>;
};

export const getStaticPaths: GetStaticPaths<{
  id: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
