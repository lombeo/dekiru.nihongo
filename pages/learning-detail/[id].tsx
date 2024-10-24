import React from "react";
import { useRouter } from "next/router";
import { LearnCourseService } from "@src/services";
import HeadSEO from "@src/components/SEO/HeadSEO";
import DefaultLayout from "@src/components/Layout/Layout";
import { useTranslation } from "next-i18next";
import { useQuery } from "@tanstack/react-query";
import BoxBanner from "@src/modules/course-detail/components/BoxBanner";
import { Container } from "@src/components";
import BoxIntroduce from "@src/modules/course-detail/components/BoxIntroduce";

const CourseDetail = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;

  const {
    data: course
  } = useQuery({
    queryKey: ["courseDetail", id], // Key cho query
    queryFn: () => LearnCourseService.getCourseDetail({ courseId: id }), // Hàm gọi API
    enabled: !!id, // Chỉ gọi API khi id có giá trị
  });

  return (
    <>
      <HeadSEO
        title={course?.data?.courseName}
        description={course?.data?.subDescription}
        ogImage={course?.data?.imageUrl}
      />
      <DefaultLayout bgGray allowAnonymous>
        <BoxBanner data={course?.data} />
        <div id="course-content">
          <Container size="xl" className="p-10">
            <div className="lg:px-32">
              <div className="grid lg:grid-cols-[1fr_376px] gap-5 relative">
                <div className="flex flex-col gap-20">
                  <BoxIntroduce data={course?.data} />
                  {/* <BoxSyllabus isEnrolled={false} data={course?.content} /> */}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </DefaultLayout>
    </>
  );
};

export default CourseDetail;
