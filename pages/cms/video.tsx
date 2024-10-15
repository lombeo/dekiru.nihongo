import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { Video } from "@src/modules/cms/video";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "category"])),
      // Will be passed to the page component as props
    },
  };
}

const VideoPage: NextPage = () => {
  return (
    <>
      <HeadSEO title={"CMS"} />
      <DefaultLayout
      // allowAnyRoles={[UserRole.Administrator, UserRole.OwnerCourse, UserRole.ManagerContent, UserRole.SiteOwner]}
      >
        <Video visibleDeleteBtn={true} visibleCheckbox={false} />
      </DefaultLayout>
    </>
  );
};

export default VideoPage;
