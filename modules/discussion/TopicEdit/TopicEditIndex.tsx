import { Breadcrumbs } from "@edn/components";
import { Flex } from "@mantine/core";
import { Container } from "@src/components";
import { useTranslation } from "next-i18next";
import FormTopic from "../TopicCreate/components/FormTopic";
import { useRouter } from "next/router";

export default function TopicEditIndex() {
  const { t } = useTranslation();
  const router = useRouter();
  const id = router.query.id;

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
                href: "/discussion",
                title: t("Discussion"),
              },
              {
                title: t("Edit"),
              },
            ]}
          />
        </Flex>
        <FormTopic topicId={id} isUpdate />
      </Container>
    </div>
  );
}
