import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { ActivityModal } from "@src/modules/cms/activities";
import { ActivityPreview } from "@src/modules/cms/activities/ActivityPreview";
import { CourseDetails } from "@src/modules/cms/courses";
import { GetStaticPaths, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"])),
    },
  };
}

const CoursePage: NextPage = () => {
  return (
    <>
      <HeadSEO title={"CMS"} />
      <DefaultLayout>
        <CourseDetails />
        <ActivityPreview />
        <ActivityModal />
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
export default CoursePage;
