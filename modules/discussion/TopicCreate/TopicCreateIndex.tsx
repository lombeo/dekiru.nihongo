import { Breadcrumbs } from "@edn/components";
import { Flex } from "@mantine/core";
import { Container } from "@src/components";
import { useTranslation } from "next-i18next";
import FormTopic from "./components/FormTopic";
import SharingService from "@src/services/Sharing/SharingService";
import { useEffect, useState } from "react";
import { NotPermission } from "@src/components/NotPermission/NotPermission";

export default function TopicCreateIndex() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [create, setCreate] = useState(null);
  const checkCreate = async () => {
    const res = await SharingService.checkCreateTopic();
    if (res.data.data) {
      setCreate(true);
    } else {
    }
    setLoading(false);
  };
  useEffect(() => {
    checkCreate();
  }, []);
  return (
    <div className="pb-20">
      {loading == true ? (
        <></>
      ) : create == true ? (
        <Container>
          <Flex className="justify-center" align="center">
            <Breadcrumbs
              data={[
                {
                  href: "/",
                  title: t("Home"),
                },
                {
                  href: "/discussion",
                  title: t("Discussion"),
                },
                {
                  title: t("Edit"),
                },
              ]}
            />
          </Flex>
          <FormTopic />
        </Container>
      ) : (
        <div className="flex justify-center my-24 w-full">
          <NotPermission />
        </div>
      )}
    </div>
  );
}
