import { Container } from "@src/components";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { ActivityTypeEnum } from "@src/constants/cms/activity/activity.constant";
import UserRole from "@src/constants/roles";
import { useHasAnyRole } from "@src/helpers/helper";
import { Activities, ActivityModal, CreateActivityButton } from "@src/modules/cms/activities";
import { DefaultSettingButton } from "@src/modules/cms/activities/DefaultSettingButton";
import CourseView from "@src/modules/cms/courses/CourseView";
import { CourseTabs } from "@src/modules/cms/courses/components/CourseTab";
import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"])),
    },
  };
}

const Home: NextPage = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const isAdmin = useHasAnyRole([
    UserRole.Administrator,
    UserRole.OwnerCourse,
    UserRole.ManagerContent,
    UserRole.SiteOwner,
  ]);

  if (!isAdmin) {
    const activityType: any = router.query.activityType ? router.query.activityType : 0;

    const enableDefaultSetting = [ActivityTypeEnum.CQ, ActivityTypeEnum.Feedback].includes(
      parseInt(activityType ?? "0")
    );

    return (
      <>
        <HeadSEO title={"CMS"} />
        <DefaultLayout>
          <Container size="xl">
            <div className="mt-4 flex items-center gap-6 justify-between">
              <div>{t("Activity management")}</div>
              <div className="flex justify-between items-center gap-3">
                {enableDefaultSetting && <DefaultSettingButton type={activityType} />}
                <CreateActivityButton activityType={activityType} />
              </div>
            </div>
            <CourseTabs />
            <Activities isActivitiesListPage={true} />
            <ActivityModal />
          </Container>
        </DefaultLayout>
      </>
    );
  }

  return (
    <>
      <HeadSEO title={"CMS"} />
      <DefaultLayout>
        <Container size="xl">
          <CourseView />
        </Container>
      </DefaultLayout>
    </>
  );
};

export default Home;
