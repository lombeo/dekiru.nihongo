import { Container } from "@src/components";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { Activities, ActivityModal } from "@src/modules/cms/activities";
import { ActivityPreview } from "@src/modules/cms/activities/ActivityPreview";
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

const ActivitiesPage: NextPage = () => {
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
          <Activities isActivitiesListPage={true} />
          <ActivityPreview />
          <ActivityModal />
        </Container>
      </DefaultLayout>
    </>
  );
};

export default ActivitiesPage;
