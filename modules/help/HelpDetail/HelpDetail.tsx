import { Breadcrumbs } from "@edn/components";
import { Card, Flex, Text } from "@mantine/core";
import { Container } from "@src/components";
import RawText from "@src/components/RawText/RawText";
import SharingService from "@src/services/Sharing/SharingService";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const HelpDetail = () => {
  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";
  const id = router.query.id;

  const { t } = useTranslation();

  const [dataHelp, setDataHelp] = useState({} as any);

  const dataMultiLang = dataHelp?.multiLang?.find((e) => e.languageKey === keyLocale) || dataHelp?.multiLang?.[0];

  const fetch = async () => {
    const res = await SharingService.helpDetail(id);
    if (res?.data?.success) {
      if (res?.data?.data) {
        setDataHelp(res?.data?.data);
      } else {
        router.push("/404");
      }
    } else {
      router.push("/404");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  return (
    <div className="pb-20">
      <Container>
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                href: "/help",
                title: t("Help"),
              },
              {
                title: t("Detail"),
              },
            ]}
          />
        </Flex>
        <Card>
          <Text className="text-2xl font-semibold pb-6">{dataMultiLang?.title}</Text>
          <RawText>{dataMultiLang?.description}</RawText>
        </Card>
      </Container>
    </div>
  );
};

export default HelpDetail;
