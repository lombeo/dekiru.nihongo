// import { LoadingOverlay } from "components";
import { Container } from "@src/components";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { QuestionBank } from "@src/modules/cms/banks/QuestionBank";
import { CourseTabs } from "@src/modules/cms/courses/components/CourseTab";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"])),
    },
  };
}

const QuestionBankPage: NextPage = () => {
  const { t } = useTranslation();

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
          <CourseTabs />
          <QuestionBank />
        </Container>
      </DefaultLayout>
    </>
  );
};

export default QuestionBankPage;
