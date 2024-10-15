import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { ActivityCode } from "@src/modules/cms/activity-code";
import { Container } from "components";
import { GetStaticPaths, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"])),
    },
  };
}

const ActivityCodePage: NextPage = () => {
  return (
    <>
      <HeadSEO title={"CMS"} />
      <DefaultLayout>
        <Container size="xl">
          <ActivityCode />
        </Container>
      </DefaultLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
export default ActivityCodePage;
