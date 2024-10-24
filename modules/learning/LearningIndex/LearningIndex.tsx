import { Button, Loader, Select, Text, TextInput } from "@mantine/core";
import { Container } from "@src/components";
import ExternalLink from "@src/components/ExternalLink";
import { NotFound } from "@src/components/Svgr/components";
import UserRole from "@src/constants/roles";
import { useHasAnyRole } from "@src/helpers/helper";
import useWindowDimensions from "@src/hooks/useWindowDimensions";
import { LearnCourseService } from "@src/services";
import { LearnService } from "@src/services/LearnService/LearnService";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Search } from "tabler-icons-react";
import BannerSwiper from "./components/BannerSwiper";
import CategoryTabs from "./components/CategoryTabs";
import CourseList from "./components/CourseList";

const LearningIndex = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;
  const { width } = useWindowDimensions();

  const canCreateCourse = useHasAnyRole([
    UserRole.Administrator,
    UserRole.SiteOwner,
    UserRole.ManagerContent,
    UserRole.OwnerCourse,
  ]);

  const [filter, setFilter] = useState({
    keyword: "",
    courseState: 0,
    courseViewLimit: canCreateCourse ? 1 : null,
    pageIndex: 1,
    pageSize: width > 768 ? 100 : 50,
    categoryId: "",
  });

  const fetchCategories = async () => {
    const res = await LearnCourseService.getCategories({
      pageIndex: 1,
      pageSize: 50,
      courseState: filter?.courseState,
      courseViewLimit: filter?.courseViewLimit,
    });
    if (res?.data?.success) {
      let data = res.data.data;
      data = _.sortBy(data, ["priority"]);
      return data;
    }
    return null;
  };

  const categoriesQuery = useQuery({
    queryKey: ["categories", locale],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 30,
    gcTime: 100 * 60 * 30,
  });

  const { data, status, isLoading, refetch } = useQuery({
    queryKey: ["getCourseList", locale, filter],
    queryFn: () => fetch(),
  });

  const fetch = async () => {
    const res = await LearnService.getCourseList({
      ...filter,
      courseViewLimit: filter.courseViewLimit === -1 ? null : filter.courseViewLimit,
    });
    if (res?.data?.success) {
      return res.data.data;
    }
    return null;
  };

  return (
    //-mt-11
    <div className="mt-0 lg:mt-0">
      {/* <div className="py-6 pb-8 bg-left bg-[length:auto_100%] bg-no-repeat bg-[url('/images/learning/new-banner-list-courses.png')]">
        <Container size="xl">
          <h2 className="md:text-[28px] text-[26px] font-bold text-white my-0">
            {t("Learning code online. Let's start with your first course!")}
          </h2>
          <div
            className={clsx("grid gap-4 items-center mt-[24px]", {
              "lg:grid-cols-[380px_168px_118px] grid-cols-[auto_118px]": !canCreateCourse,
              "lg:grid-cols-[380px_168px_178px_118px] grid-cols-[auto_118px]": canCreateCourse,
            })}
          >
            <TextInput
              placeholder={t("LearningPage.Search")}
              height={45}
              classNames={{
                root: "w-full",
                input: "border-none h-[45px]",
              }}
              className={styles.input}
              id="search-course"
              onKeyDown={(event: any) => {
                if (event && event.key === "Enter") {
                  setFilter((prev) => ({ ...prev, pageIndex: 1, keyword: event.target.value }));
                }
              }}
              onBlur={(event: any) =>
                setFilter((prev) => ({
                  ...prev,
                  pageIndex: 1,
                  keyword: (document.getElementById("search-course") as any)?.value,
                }))
              }
              size="md"
              rightSection={<Search color="#4C1CDA" onClick={() => fetch()} />}
            />
            {profile && !canCreateCourse && (
              <Select
                size="md"
                height={45}
                classNames={{
                  input: "border-none h-[45px] text-[15px] pr-6",
                  item: "text-[15px] px-2 py-2",
                  rightSection: "w-[26px]",
                }}
                value={filter.courseState?.toString()}
                onChange={(value) => {
                  setFilter((prev) => ({ ...prev, courseState: +value }));
                }}
                data={[
                  { label: t("All"), value: "0" },
                  { label: t("Enrolled"), value: "2" },
                  { label: t("Unregistered"), value: "5" },
                ]}
              />
            )}
          </div>
        </Container>
      </div> */}
      <Container size="xl">
        <BannerSwiper />
        <CategoryTabs filter={filter} setFilter={setFilter} categoryList={categoriesQuery?.data} />

        <div className="w-full max-w-[1200px] m-auto mt-4 flex flex-col gmd:flex-row items-start gmd:items-center gap-4">
          <TextInput
            placeholder={t("LearningPage.Search")}
            height={45}
            classNames={{
              root: "w-full",
              input: "border-none h-[45px] shadow-[0px_5px_12px_0px_#0000001A]",
            }}
            className="flex-1"
            id="search-course"
            onKeyDown={(event: any) => {
              if (event && event.key === "Enter") {
                setFilter((prev) => ({ ...prev, pageIndex: 1, keyword: event.target.value }));
              }
            }}
            onBlur={(event: any) =>
              setFilter((prev) => ({
                ...prev,
                pageIndex: 1,
                keyword: (document.getElementById("search-course") as any)?.value,
              }))
            }
            size="md"
            rightSection={<Search color="#4C1CDA" onClick={() => fetch()} />}
          />
          {!canCreateCourse && <div className="bg-transparent flex-1" />}
          {canCreateCourse && (
            <div className="w-fit flex flex-wrap sm:flex-row gap-4 flex-1">
              <Select
                size="md"
                height={45}
                className="shadow-[0px_5px_12px_0px_#0000001A]"
                classNames={{
                  input: "border-none h-[45px] text-[15px] pr-6",
                  item: "text-[15px] px-2 py-2",
                  rightSection: "w-[26px]",
                }}
                value={filter.courseViewLimit?.toString()}
                onChange={(value) => {
                  setFilter((prev) => ({ ...prev, courseViewLimit: +value }));
                }}
                placeholder={t("View limit")}
                data={[
                  { label: t("All"), value: "-1" },
                  { label: t("Public"), value: "1" },
                  { label: t("Private"), value: "0" },
                ]}
              />
              <Select
                size="md"
                height={45}
                className="flex-1 shadow-[0px_5px_12px_0px_#0000001A]"
                classNames={{
                  input: "border-none h-[45px] text-[15px] pr-6",
                  item: "text-[15px] px-2 py-2",
                  rightSection: "w-[26px]",
                }}
                value={filter.courseState?.toString()}
                onChange={(value) => {
                  setFilter((prev) => ({ ...prev, courseState: +value }));
                }}
                placeholder={t("Register status")}
                data={[
                  { label: t("All"), value: "0" },
                  { label: t("Enrolled"), value: "2" },
                  { label: t("Unregistered"), value: "5" },
                ]}
              />
              <ExternalLink href={`/cms/course/create?type=1`}>
                <Button className="h-[45px] bg-[#F56060]" color="red">
                  {t("Create Course")}
                </Button>
              </ExternalLink>
            </div>
          )}
        </div>

        <div className="w-full max-w-[1200px] m-auto mt-4 mb-12">
          <CourseList courses={data} refetch={refetch} />
          {/* {categoriesQuery?.data?.map((item) => (
            <CourseListMobile
              key={`mobile-category-${item?.id}`}
              courses={data}
              category={item}
              refetch={refetch}
              filter={filter}
              setFilter={setFilter}
              isLoading={isLoading}
            />
          ))} */}
        </div>

        {isLoading && (
          <div className="my-20 hidden md:flex justify-center">
            <Loader color="blue" />
          </div>
        )}
        {status === "success" && (!data || data.length <= 0) && (
          <div className="w-full max-w-[1200px] flex flex-col items-center justify-center mb-10 bg-white py-10 mt-10 mx-auto overflow-hidden">
            <NotFound height={199} width={350} />
            <Text mt="lg" size="lg" fw="bold">
              {t("No result found")}
            </Text>
          </div>
        )}
      </Container>
    </div>
  );
};

export default LearningIndex;
