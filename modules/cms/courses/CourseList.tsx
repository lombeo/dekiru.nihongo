import Link from "@src/components/Link";
import { NotFound } from "@src/components/NotFound/NotFound";
import { COURSE_URL } from "@src/constants/cms/course/course.constant";
import { useNextQueryParam } from "@src/helpers/query-utils";
import { AppPagination, Select } from "components/cms/core";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";
import { CourseListItem } from "./CourseListItem";

interface PaginationProps {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface CourseListProps {
  courses: any[];
  pagination?: PaginationProps;
  onChangePage?: any;
  onFilter: any;
}

export const CourseList = ({ pagination, onChangePage, onFilter, courses }: CourseListProps) => {
  const { t } = useTranslation();

  const sortOption = [
    { value: "newest", label: t("Newest") },
    { value: "oldest", label: t("Oldest") },
  ];

  const sortByFromParam = useNextQueryParam("sortBy");
  // let sortByOption =
  //   sortByFromParam == 'newest' || sortByFromParam == 'oldest'
  //     ? sortByFromParam
  //     : sortOption[0].value

  const [sortByOption, setSortByOption] = useState(
    sortByFromParam == "newest" || sortByFromParam == "oldest" ? sortByFromParam : sortOption[0].value
  );

  const onOrderBy = (value: any) => {
    setSortByOption(value);
    onFilter &&
      onFilter({
        sortBy: value,
      });
  };

  useEffect(() => {
    PubSub.subscribe("RESET_CONFIRMATION", () => {
      setSortByOption("newest");
    });
  }, []);

  if (!courses || !courses.length) {
    return (
      <NotFound size="page" className="mt-10">
        {t("You have no course.")}
        <Link href={COURSE_URL.DETAIL}>
          <div className="text-blue-500 ml-1">{t("Create New Course")}</div>
        </Link>
      </NotFound>
    );
  }

  return (
    <div className="course-list">
      <div className="flex justify-between items-center mt-6">
        <div className="text-base font-semibold">
          {t(LocaleKeys["Courses"])}
          <span className="text-blue-500 ml-1">({pagination?.totalItems})</span>
        </div>
        <div className="flex gap-3 items-center">
          <span className="hidden md:block text-sm">{t(LocaleKeys["Sort by"])}:</span>
          <Select
            classNames={{
              input: "h-10",
            }}
            onChange={onOrderBy}
            defaultChecked={true}
            //defaultValue={sortByOption}
            value={sortByOption}
            data={sortOption}
          />
        </div>
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {courses && courses.map((course: any, index: number) => <CourseListItem data={course} key={index} />)}
        </div>
        {pagination && courses.length > 0 && (
          <div className="mt-7">
            <AppPagination
              onChange={onChangePage}
              pageIndex={pagination.pageIndex}
              pageSize={pagination.pageSize}
              currentPageSize={courses.length}
              totalItems={pagination.totalItems}
              totalPages={pagination.totalPages}
              label={pagination.totalItems > 1 ? t("courses") : t("course")}
            />
          </div>
        )}
      </div>
    </div>
  );
};
