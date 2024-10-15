import { Breadcrumbs } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Button, Flex, Input, Loader, Pagination, Select, Text } from "@mantine/core";
import { Container } from "@src/components";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useNextQueryParam } from "@src/helpers/query-utils";
import useDebounce from "@src/hooks/useDebounce";
import { LearnClassesService } from "@src/services";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Search } from "tabler-icons-react";
import StudentListTable from "./components/StudentListTable";

const ClassCourseDetails = () => {
  const { t } = useTranslation();
  const classId = useNextQueryParam("classId");
  const courseId = useNextQueryParam("courseid");
  const [chapterTarget, setChapterTarget] = useState("0");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({} as any);
  const locale = router.locale;
  const langKey = locale === "vi" ? "vn" : "en";
  const [filter, setFilter] = useState({
    classId: classId,
    courseId: courseId,
    pageIndex: 1,
    pageSize: 10,
    textSearch: "",
    status: 0,
    langKey: langKey,
  });
  const filterDebounce = useDebounce(filter);
  const chaptersData =
    data?.chapters?.map((chapter, index) => {
      return {
        label: `${index + 1}-${chapter.chapterName}`,
        value: index + 1,
      };
    }) ?? [];

  const handleExportTask = async () => {
    const res = await LearnClassesService.exportTasksGit({
      classId: +classId,
      courseId: +courseId,
    });
    const data = res?.data?.data;
    if (res?.data?.success && data) {
      Notify.success(t("Export successfully!"));
      let contentType = "application/vnd.ms-excel";
      let excelFile = FunctionBase.b64toBlob(data?.contents, contentType);
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(excelFile);
      link.download = data?.filename;
      link.click();
    } else if (res?.data?.message) {
      Notify.error(t(res?.data?.message));
    }
  };
  const fetch = async () => {
    const res = await LearnClassesService.getClassProgress({
      ...filter,
    });
    if (!res?.data?.data?.isClassManager) {
      router.push("/403");
    } else if (res?.data?.success) {
      setData(res.data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [filterDebounce]);

  return (
    <div className="pb-20">
      <Container>
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                href: "/classmanagement",
                title: t("List class"),
              },
              {
                href: `/classmanagement/classdetails/${classId}`,
                title: t("Class detail"),
              },
              {
                title: t("Course"),
              },
            ]}
          />
        </Flex>
        <div className="flex flex-col md:flex-row justify-between mt-4">
          <Text className="text-2xl font-semibold">{data?.courseTitle}</Text>
          {/* <Button variant="subtle">{t("Create the evaluation")}</Button> */}
        </div>
        <div className="py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between flex-wrap gap-4">
            <Input
              placeholder={t("Name of examinee or name test")}
              rightSection={<Search color="gray" />}
              className="md:min-w-[300px]"
              onChange={(value) =>
                setFilter((pre) => ({
                  ...pre,
                  textSearch: value.target.value.trim(),
                }))
              }
            />
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Text className="w-[80px] md:w-auto">{t("Chapter")}</Text>
                <Select
                  data={[{ value: "0", label: t("All") }, ...chaptersData]}
                  value={chapterTarget}
                  className="md:w-[280px]"
                  onChange={(value) => {
                    setChapterTarget(value);
                  }}
                />
              </div>
              <div className="flex items-center gap-3">
                <Text className="w-[80px] md:w-auto">{t("Status")}</Text>
                <Select
                  data={[
                    {
                      label: t("All"),
                      value: "0",
                    },
                    {
                      label: t("Completed"),
                      value: "1",
                    },
                    {
                      label: t("Not completed"),
                      value: "2",
                    },
                  ]}
                  defaultValue="0"
                  onChange={(value) => {
                    setFilter((pre) => ({
                      ...pre,
                      status: +value,
                    }));
                  }}
                  className="w-[150px]"
                />
              </div>
              {data?.isClassManager && (
                <Button variant="subtle" onClick={handleExportTask}>
                  {t("Export Assignment")}
                </Button>
              )}
            </div>
          </div>
        </div>
        <div>
          {loading ? (
            <div className="flex justify-center pt-10">
              <Loader />
            </div>
          ) : (
            <div className="overflow-x-auto overflow-y-hidden sm:overflow-visible">
              <StudentListTable dataListStudent={data} chapterTargetIndex={+chapterTarget} />
            </div>
          )}
          {!loading && (
            <div className="flex justify-center pt-16">
              <Pagination
                withEdges
                value={data?.listMember?.currentPage}
                total={data?.listMember?.pageCount}
                onChange={(pageIndex) => {
                  setFilter((prev) => ({
                    ...prev,
                    pageIndex: pageIndex,
                  }));
                }}
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ClassCourseDetails;
