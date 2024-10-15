import { useMediaQuery } from "@mantine/hooks";
import CodelearnInactive from "@src/components/Svgr/components/CodelearnInactive";
import CourseCardItem from "@src/modules/learning/LearningIndex/components/CourseCardItem";
import { useTranslation } from "next-i18next";
import "swiper/css";
import "swiper/css/pagination";
import { Grid, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./SubCourses.module.scss";

interface SubCoursesProps {
  data: any;
}

const SubCourses = (props: SubCoursesProps) => {
  const { t } = useTranslation();
  const { data } = props;

  const isDesktop = useMediaQuery("(min-width: 1480px)");

  const courses = data?.subCourses || [];
  const countEmptySpan = courses ? 3 - courses.length : 0;

  return (
    <div className="pt-8">
      <h4 className="my-0 font-semibold text-[24px]">
        {courses.length} {t("course series")}
      </h4>
      <div className="mt-6 relative md:max-w-[786px] max-w-[calc(100vw_-_32px)]">
        <Swiper
          slidesPerView={3}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1200: {
              slidesPerView: 3,
            },
          }}
          className={styles.root}
          spaceBetween={12}
          keyboard={{
            enabled: true,
          }}
          pagination={{
            enabled: true,
            clickable: true,
          }}
          modules={[Grid, Keyboard, Pagination]}
        >
          {courses?.map((item) => (
            <SwiperSlide key={item.id} className="!h-auto px-1">
              <CourseCardItem data={item} />
            </SwiperSlide>
          ))}
          {isDesktop &&
            countEmptySpan > 0 &&
            Array.apply(null, Array(countEmptySpan)).map((e, key) => (
              <SwiperSlide key={key} className="!h-auto">
                <div className="pt-[6px] h-full min-h-[320px]">
                  <div className="h-full flex items-center justify-center bg-[#FAFAFA] rounded-md overflow-hidden">
                    <CodelearnInactive width={70} height={90} />
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SubCourses;
