import { Container } from "@src/components";
import { Notify } from "@src/components/cms";
import { useNextQueryParam } from "@src/helpers/query-utils";
import { LearnCourseService } from "@src/services";
import { CommentContextType } from "@src/services/CommentService/types";
import { selectProfile } from "@src/store/slices/authSlice";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import Comment from "../../components/Comment/Comment";
import Enrollments from "../enrolments/Enrollments";
import BoxBanner from "./components/BoxBanner";
import BoxCertificate from "./components/BoxCertificate";
import BoxInView from "./components/BoxInView";
import BoxIntroduce from "./components/BoxIntroduce";
import BoxReviews from "./components/BoxReviews/BoxReviews";
import BoxSticky from "./components/BoxSticky/BoxSticky";
import BoxSyllabus from "./components/BoxSyllabus";
import BoxTab from "./components/BoxTab/BoxTab";
import CourseManager from "./components/CourseManager";
import BoxMyVoucher from "./components/MyVoucher/BoxMyVoucher";
import SubCourses from "./components/SubCourses/SubCourses";
import BoxVoucher from "./components/Voucher/BoxVoucher";
import useCourseRole from "./hooks/useCourseRole";
import { CourseDetailContextProvider } from "./context/CourseDetailContext";

interface CourseDetailProps {
  permalink: string;
}

const CourseDetail = (props: CourseDetailProps) => {
  const { permalink } = props;

  const queryClient = useQueryClient();

  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;

  const activeTab = useNextQueryParam("tab") || "introduce";

  const profile = useSelector(selectProfile);

  const courseQueryKey = ["course-detail", permalink, locale];
  const [currentTab, _setCurrentTab] = useState<string>(activeTab);

  const setCurrentTab = useCallback(_.debounce(_setCurrentTab, 300), []);
  
  const { data, refetch } = useQuery({
    queryKey: courseQueryKey,
    queryFn: async () => {
      const res = await LearnCourseService.getCourseDetail({
        permalink: permalink,
      });
      let data = res?.data?.data;
      if (res?.data?.code === 403) {
        router.push("/403");
        return null;
      } else if (res?.data?.message) {
        Notify.error(t(res.data.message));
      }
      return data;
    },
  });

  const { isCourseManager, isStudentManager, isCanViewReport, isCanCreateVoucher } = useCourseRole(data);

  const courseId = data?.courseId;
  const isEnroll = data?.isEnroll;

  const ratingQuery = useQuery({
    queryKey: ["rating", courseId],
    queryFn: async () => {
      if (!courseId) return null;
      const res = await LearnCourseService.getCourseRatings({
        pageIndex: 1,
        pageSize: 20,
        contextId: courseId,
        contextType: CommentContextType.Course,
        getDetails: true,
        progress: false,
      });
      return res?.data?.data;
    },
  });

  const refreshData = () => {
    refetch();
  };

  const handleChangeTab = (tab: string) => {
    router
      .replace(
        {
          pathname: `/learning/${permalink}`,
          query: {
            tab: tab,
          },
        },
        null,
        {
          shallow: true,
        }
      )
      .then(() => {
        _setCurrentTab(tab);
        const element = document.getElementById(tab);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      });
  };

  return (
    <div className="border-b pb-20">
      <CourseDetailContextProvider>
        <BoxBanner refreshData={refreshData} isCourseManager={isCourseManager} data={data} rating={ratingQuery.data} />
        <BoxTab data={data} refreshData={refreshData} handleChangeTab={handleChangeTab} currentTab={currentTab} />
        <div id="course-content">
          <Container size="xl">
            <div className="lg:px-32">
              {["introduce", "syllabus", "reviews", "certificate"].includes(activeTab) && (
                <div className="grid lg:grid-cols-[1fr_376px] gap-5 relative">
                  <div className="flex flex-col gap-20">
                    {data?.isCombo && <SubCourses data={data} />}
                    <BoxInView onView={(tab) => setCurrentTab(tab)} tab="introduce" permalink={permalink}>
                      <BoxIntroduce data={data} />
                    </BoxInView>
                    {!data?.isCombo && (
                      <BoxInView
                        onView={(tab) => {
                          setCurrentTab(tab);
                          console.log(tab);
                        }}
                        tab="syllabus"
                        permalink={permalink}
                      >
                        <BoxSyllabus isEnrolled={data?.isEnroll} data={data?.courseSchedule?.courseScheduleList} />
                      </BoxInView>
                    )}
                    <BoxInView onView={(tab) => setCurrentTab(tab)} tab="reviews" permalink={permalink}>
                      <BoxReviews
                        isEnroll={isEnroll}
                        courseId={courseId}
                        data={ratingQuery.data}
                        refreshData={ratingQuery.refetch}
                      />
                    </BoxInView>
                    <BoxInView onView={(tab) => setCurrentTab(tab)} tab="certificate" permalink={permalink}>
                      <BoxCertificate data={data} />
                    </BoxInView>
                  </div>
                  <BoxSticky data={data} refreshData={refreshData} isCourseManager={isCourseManager} />
                </div>
              )}
              <div>
                {activeTab === "comment" && profile && !!data && (
                  <div className="my-6 min-h-[calc(100vh_-_500px)]">
                    <Comment
                      title={data?.title}
                      detailedLink={router.asPath}
                      isManager={isCourseManager}
                      fetchedCallback={(comment) => {
                        queryClient.setQueryData(courseQueryKey, {
                          ...data,
                          totalComment: comment?.total,
                        });
                      }}
                      contextId={data?.id}
                      contextType={CommentContextType.Course}
                    />
                  </div>
                )}
                {activeTab === "permission" && (isCourseManager || !!data?.isOrgManager) && (
                  <CourseManager
                    refreshCourse={refreshData}
                    ownerId={data?.owner?.userId}
                    data={data?.courseUsers}
                    courseId={data?.id}
                  />
                )}
                {activeTab === "learners" && !!data && (isStudentManager || isCanViewReport) && (
                  <Enrollments
                    isStudentManager={isStudentManager}
                    isCourseManager={isCourseManager}
                    courseId={data?.id}
                  />
                )}
                {activeTab === "voucher-management" && !!data && isCanCreateVoucher && (
                  <BoxVoucher contextId={data?.id} contextType={CommentContextType.Course} course={data} />
                )}
                {activeTab === "my-vouchers" && !!data && !isCanCreateVoucher && (
                  <BoxMyVoucher course={data} contextId={data?.id} />
                )}
              </div>
            </div>
          </Container>
        </div>
      </CourseDetailContextProvider>
    </div>
  );
};

export default CourseDetail;
