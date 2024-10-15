import { Loader } from "@mantine/core";
import RawText from "@src/components/RawText/RawText";
import { ID_HELP_TRAINING } from "@src/config";
import SharingService from "@src/services/Sharing/SharingService";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./help.module.scss";

const Help = ({ helId = ID_HELP_TRAINING }: { helId?: any }) => {
  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";
  const [isLoading, setIsLoading] = useState(true);
  const [dataHelp, setDataHelp] = useState({} as any);
  const dataMultiLang = dataHelp?.multiLang?.find((e) => e.languageKey === keyLocale) || dataHelp?.multiLang?.[0];

  const fetch = async () => {
    setIsLoading(true);
    const res = await SharingService.helpDetail(helId);
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
    <div className={styles.content}>
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

export default Help;
