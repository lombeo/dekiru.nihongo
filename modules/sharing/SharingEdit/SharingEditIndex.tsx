import { Breadcrumbs } from "@edn/components";
import { Flex } from "@mantine/core";
import { Container } from "@src/components";
import { useTranslation } from "next-i18next";
import FormSharing from "../SharingCreate/components/FormSharing";
import { useRouter } from "next/router";

const SharingEditIndex = () => {
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
                href: "/sharing",
                title: t("Sharing"),
              },
              {
                title: t("Edit posts"),
              },
            ]}
          />
        </Flex>
        <FormSharing blogId={id} isUpdate />
      </Container>
    </div>
  );
};
export default SharingEditIndex;
