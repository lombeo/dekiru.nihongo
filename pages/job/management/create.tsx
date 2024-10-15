import DefaultLayout from "@src/components/Layout/Layout";
import React, { useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import FormJob from "@src/modules/job/FormJob";
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
  const router = useRouter();

  const { isManager, loading } = useIsManagerRecruitment();

  useEffect(() => {
    if (!loading && !isManager) {
      router.push("/403");
    }
  }, [isManager, loading]);

  if (loading || !isManager) return null;

  return <FormJob />;
};
