import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CourseItem, { CourseItemProps } from "../CouseItem";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { ArrowChervonBigUp } from "@src/components/Svgr/components";
import { Loader } from "@mantine/core";

type CourseListMobileProps = {
  filter: {
    keyword: string;
    courseState: number;
    courseViewLimit: number;
    pageIndex: number;
    pageSize: number;
    categoryId: string;
  };
  setFilter: Dispatch<
    SetStateAction<{
      keyword: string;
      courseState: number;
      courseViewLimit: number;
      pageIndex: number;
      pageSize: number;
      categoryId: string;
    }>
  >;
  courses: CourseItemProps[];
  category: any;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>;
  isLoading: boolean;
};

const CourseListMobile: React.FC<CourseListMobileProps> = ({
  courses,
  category,
  refetch,
  filter,
  setFilter,
  isLoading,
}) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const handleChooseCategory = () => {
    setIsOpened(!isOpened);
    setFilter((prev) => {
      return { ...prev, categoryId: category?.id };
    });
    // const element = document.getElementById(`mobile-category-${category?.id}`);

    // if (element !== null && !isLoading) {
    //   element.scrollIntoView({ behavior: "smooth" });
    // }
  };

  useEffect(() => {
    if (filter?.categoryId !== category?.id) {
      setIsOpened(false);
    }
  }, [filter?.categoryId]);

  return (
    <>
      {category?.countCourse > 0 && (
        <div id={`mobile-category-${category?.id}`} className="border-t-[1px] border-[#D1D5D8] md:hidden">
          <button onClick={handleChooseCategory} className="h-12 flex items-center w-full justify-between gap-[10px] bg-transparent">
            <span className="font-normal text-sm leading-6 text-[#111928]">{category?.name}</span>
            <ArrowChervonBigUp className={`transform duration-200 ${isOpened ? "rotate-180" : ""}`} />
          </button>

          {isOpened && (
            <div className="grid w-full grid-cols-12 gap-4 mb-6">
              {courses &&
                courses.map((item, index) => (
                  <CourseItem key={`course-${item?.courseId}`} data={item} refetch={refetch} />
                ))}
            </div>
          )}

          {isLoading && (
            <div className="my-20 hidden md:flex justify-center">
              <Loader color="blue" />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CourseListMobile;
