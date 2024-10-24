import { Container } from "@src/components";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { ActivityPreview } from "@src/modules/cms/activities/ActivityPreview";
import CourseView from "@src/modules/cms/courses/CourseView";
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
const CoursesPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeadSEO title={"CMS"} />
      <DefaultLayout>
        <Container size="xl">
          <CourseView />
          <ActivityPreview />
        </Container>
      </DefaultLayout>
    </>
  );
};

export default CoursesPage;
