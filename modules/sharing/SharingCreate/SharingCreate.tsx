import { Breadcrumbs } from "@edn/components";
import { Flex } from "@mantine/core";
import { Container } from "@src/components";
import { useTranslation } from "next-i18next";
import FormSharing from "./components/FormSharing";

const SharingCreate = () => {
  const { t } = useTranslation();

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
                href: "/sharing",
                title: t("Sharing"),
              },
              {
                title: t("New posts"),
              },
            ]}
          />
        </Flex>
        <FormSharing />
      </Container>
    </div>
  );
};
export default SharingCreate;
