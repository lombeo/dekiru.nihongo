import DefaultLayout from "@src/components/Layout/Layout";
import React, { useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import FormCompany from "@src/modules/company/FormCompany";
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
      <WrapForm />
    </DefaultLayout>
  );
};

export default Page;

const WrapForm = () => {
  const router = useRouter();

  const { isManager, loading } = useIsManagerRecruitment();

  useEffect(() => {
    if (!loading && !isManager) {
      router.push("/403");
    }
  }, [isManager, loading]);

  if (loading || !isManager) return null;

  return <FormCompany />;
};
