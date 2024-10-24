import DefaultLayout from "@src/components/Layout/Layout";
import React, { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HelpForm from "@src/modules/help/HelpForm";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import SharingService from "@src/services/Sharing/SharingService";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const HelpCreatePage = () => {
  const id: any = +FunctionBase.getParameterByName("id");
  const isUpdate = !!id;
  const [data, setData] = useState(null);

  const fetch = async () => {
    const res = await SharingService.helpDetail(id);
    if (res?.data?.success) {
      setData(res.data.data);
    }
  };

  useEffect(() => {
    if (isUpdate) {
      fetch();
    }
  }, [id]);

  return (
    <DefaultLayout bgGray>{!isUpdate || !!data ? <HelpForm data={data} isUpdate={isUpdate} /> : null}</DefaultLayout>
  );
};

export default HelpCreatePage;
