import React, { useEffect, useState } from "react";
import RawText from "@src/components/RawText/RawText";
import { useRouter } from "next/router";
import SharingService from "@src/services/Sharing/SharingService";
import { Loader } from "@mantine/core";
import { ID_HELP_FIGHTS } from "@src/config";

interface BoxFAQProps {}

const BoxFAQ = (props: BoxFAQProps) => {
  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";
  const [isLoading, setIsLoading] = useState(true);
  const [dataHelp, setDataHelp] = useState({} as any);
  const dataMultiLang = dataHelp?.multiLang?.find((e) => e.languageKey === keyLocale) || dataHelp?.multiLang?.[0];

  const fetch = async () => {
    setIsLoading(true);
    const res = await SharingService.helpDetail(ID_HELP_FIGHTS);
    if (res?.data?.success) {
      setDataHelp(res?.data?.data);
    }
    setIsLoading(false);
    return null;
  };
  useEffect(() => {
    fetch();
  }, []);
  return (
    <div className="bg-white p-4 mb-20">
      {isLoading ? (
        <div className="flex justify-center pt-52">
          <Loader />
        </div>
      ) : (
        <RawText>{dataMultiLang?.description}</RawText>
      )}
    </div>
  );
};

export default BoxFAQ;
