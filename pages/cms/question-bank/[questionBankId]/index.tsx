import { Container } from "@src/components";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { QuestionBankDetails } from "@src/modules/cms/banks/QuestionBankDetails";
import { GetStaticPaths, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"])),
    },
  };
}

const QuestionBankDetailPage: NextPage = () => {
  return (
    <>
      <HeadSEO title={"CMS"} />
      <DefaultLayout
      // allowAnyRoles={[
      //   UserRole.Administrator,
      //   UserRole.OwnerCourse,
      //   UserRole.ManagerContent,
      //   UserRole.SiteOwner,
      //   UserRole.OwnerContest,
      //   UserRole.TestCenter,
      //   UserRole.OwnerTestCenter,
      //   UserRole.ReviewTestCenter,
      //   UserRole.ManagerTestCenter,
      // ]}
      >
        <Container size="xl">
          <QuestionBankDetails />
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
export default QuestionBankDetailPage;
