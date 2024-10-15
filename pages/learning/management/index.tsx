import { Breadcrumbs } from "@edn/components";
import { Flex } from "@mantine/core";
import { Container } from "@src/components";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import BannerManagement from "@src/modules/learning/BannerManagement";
import axios from "axios";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const LearningBannerManagement: NextPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <HeadSEO title={t("Learning")} />
      <DefaultLayout bgGray allowAnonymous>
        <Container size="xl">
          <Flex className="justify-center" align="center">
            <Breadcrumbs
              data={[
                {
                  href: "/",
                  title: t("Home"),
                },
                {
                  title: t("Banner management"),
                },
              ]}
            />
          </Flex>
          <BannerManagement />
        </Container>
      </DefaultLayout>
    </>
  );
};

export default LearningBannerManagement;
