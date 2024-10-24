import { Container } from "@src/components";
import Link from "@src/components/Link";
import { PubsubTopic } from "@src/constants/common.constant";
import GroupCourseSwiper from "@src/modules/home/components/BoxCourse/components/GroupCourseSwiper";
import GroupCourseSwiperSkeleton from "@src/modules/home/components/BoxCourse/components/GroupCourseSwiperSkeleton";
import { LearnService } from "@src/services/LearnService/LearnService";
import { selectProfile } from "@src/store/slices/authSlice";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const BoxCourse = () => {
  const { t } = useTranslation();

  const profile = useSelector(selectProfile);

  const [courses, setCourses] = useState(null);
  const [tabActive, setTabActive] = useState("suggested");

  const fetchData = async () => {
    const res = await LearnService.getCourseList();
    const data = res?.data?.data;
    if (!data) return;
    setCourses(data);
    if (data.length <= 0) {
      if (data.hasLearningCourses) {
        setTabActive("in-progress");
      } else if (data.hasCompletedCourses) {
        setTabActive("completed");
      }
    }
    PubSub.publish(PubsubTopic.UPDATE_SUMMARY_HOME, {
      course: data,
    });
  };

  useEffect(() => {
    fetchData();
  }, [profile?.userId]);

  return (
    <div className="mt-8">
      <Container size="xl">
        {/* <h3 className="my-0 font-bold text-[#2c31cf] text-[26px]">{t("Courses")}</h3> */}
        <div className="flex gap-5 justify-between mt-2 flex-wrap">
          <div className="flex gap-5 lg:gap-x-10 items-center flex-wrap text-[#65656d] text-[18px] font-[700]">
            {[
              {
                value: "suggested",
                label: t("Suggested courses"),
                hidden: !courses?.suggestedCourses || courses.suggestedCourses.length <= 0,
              },
              {
                value: "in-progress",
                label: t("In progress") + ` (${courses?.totalLearningCourses || "0"})`,
                hidden: !profile || !courses?.hasLearningCourses,
              },
              {
                value: "completed",
                label: t("Completed") + ` (${courses?.totalCompletedCourses || "0"})`,
                hidden: !profile || !courses?.hasCompletedCourses,
              },
            ]
              .filter((e) => !e.hidden)
              .map((item, index) => (
                <div
                  key={item.label}
                  id={`t${index + 4}`}
                  className={clsx(
                    "relative py-[10px] transition-all font-bold after: hover:text-[#2c31cf] cursor-pointer after:bg-[#2c31cf] after:absolute after:left-0 after:content-[''] after:bottom-0 after:h-[3px] after:w-[0px] hover:after:w-[50px] after:transition-all",
                    {
                      "text-[#2c31cf] after:!w-[50px]": tabActive === item.value,
                    }
                  )}
                  onClick={() => setTabActive(item.value)}
                >
                  {item.label}
                </div>
              ))}
          </div>
          <Link href="/learning">{t("See all")}</Link>
        </div>
        {courses ? (
          <>
            {"suggested" === tabActive && <GroupCourseSwiper courses={courses.suggestedCourses} />}
            {"in-progress" === tabActive && <GroupCourseSwiper courses={courses.learningCourses} />}
            {"completed" === tabActive && <GroupCourseSwiper courses={courses.completedCourses} />}
          </>
        ) : (
          <GroupCourseSwiperSkeleton />
        )}
      </Container>
    </div>
  );
};

export default BoxCourse;
