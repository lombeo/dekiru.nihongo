import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { ActivityTypeEnum } from "@src/constants/common.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage } from "@src/helpers/helper";
import { useRouter } from "@src/hooks/useRouter";
import ActivityDetail from "@src/modules/activities/components/ActivityDetail";
import CourseDetail from "@src/modules/course-detail/CourseDetail";
import ScheduleView from "@src/modules/courses/components/ScheduleView";
import CodelearnIDE from "@src/packages/codelearn/src/components/CodelearnIDE/CodelearnIDE";
import IdeContextProvider from "@src/packages/codelearn/src/components/CodelearnIDE/IdeContext";
import axios from "axios";
import { GetStaticPaths, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale, params }: any) {
  const res = await axios.get(`/learn/course/get-course-for-seo`, {
    params: {
      permalink: params.permalink,
    },
    baseURL: process.env.NEXT_PUBLIC_API_LEARNV2,
  });
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      course: res.data.data,
    },
    revalidate: 86400,
  };
}

const Page: NextPage = (props: any) => {
  const router = useRouter();
  const locale = router.locale;
  const permalink = router.query.permalink as any;
  const activityType: any = +FunctionBase.getParameterByName("activityType");
  const scheduleId: any = FunctionBase.getParameterByName("scheduleId");
  const activityId: any = +FunctionBase.getParameterByName("activityId");
  const sectionId: any = +FunctionBase.getParameterByName("sectionId");

  if (activityId && activityType === ActivityTypeEnum.Code) {
    return (
      <>
        <HeadSEO
          title={resolveLanguage(props.course, locale)?.title}
          description={resolveLanguage(props.course, locale)?.summary}
          ogImage={props.course?.thumbnail}
        />
        <DefaultLayout allowAnonymous hiddenFooter hiddenChat>
          <IdeContextProvider>
            <CodelearnIDE />
          </IdeContextProvider>
        </DefaultLayout>
      </>
    );
  }

  if (scheduleId || (activityId && activityType)) {
    return (
      <>
        <HeadSEO
          title={resolveLanguage(props.course, locale)?.title}
          description={resolveLanguage(props.course, locale)?.summary}
          ogImage={props.course?.thumbnail}
        />
        <DefaultLayout bgGray allowAnonymous>
          {scheduleId ? (
            <ScheduleView sectionId={sectionId} permalink={permalink} scheduleId={scheduleId} />
          ) : (
            <ActivityDetail permalink={permalink} activityId={activityId} />
          )}
        </DefaultLayout>
      </>
    );
  }

  return (
    <>
      <HeadSEO
        title={resolveLanguage(props.course, locale)?.title}
        description={resolveLanguage(props.course, locale)?.summary}
        ogImage={props.course?.thumbnail}
      />
      <DefaultLayout allowAnonymous>
        <CourseDetail permalink={permalink} />
      </DefaultLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths<{ permalink: string }> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default Page;
