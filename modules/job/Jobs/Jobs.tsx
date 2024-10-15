import { Breadcrumbs, Text } from "@edn/components";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Badge, Button, Container, Image, MultiSelect, Pagination, Select, TextInput } from "@mantine/core";
import { getAccessToken } from "@src/api/axiosInstance";
import Link from "@src/components/Link";
import useCountries from "@src/hooks/useCountries";
import useIsManagerRecruitment from "@src/hooks/useIsManagerRecruitment";
import useRecruitmentMasterData from "@src/hooks/useRecruitmentMasterData";
import JobItem from "@src/modules/job/Jobs/components/JobItem";
import { RecruitmentService } from "@src/services/RecruitmentService/RecruitmentService.ts";
import { selectProfile } from "@src/store/slices/authSlice";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import _, { cloneDeep, isNil, trim } from "lodash";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Search } from "tabler-icons-react";

const Jobs = () => {
  const { t } = useTranslation();

  const [filter, setFilter] = useState<any>({ pageIndex: 1, pageSize: 20, orderBy: 0 });

  const { stateVNOptionsWithAll } = useCountries();

  const { isManager } = useIsManagerRecruitment();

  const token = getAccessToken();

  const profile = useSelector(selectProfile);

  const {
    industryOptions,
    workingTypeOptionsWithAll,
    salaryOptionsWithAll,
    literacyOptionsWithAll,
    experienceOptionsWithAll,
    jobLevelOptionsWithAll,
    genderOptionsWithAll,
  } = useRecruitmentMasterData();

  const fetchData = async () => {
    const _filter = cloneDeep(filter);
    if (_filter.salaryValue) {
      const salaryOptionItem = salaryOptionsWithAll.find((e) => e.value == _filter.salaryValue);
      if (salaryOptionItem && salaryOptionItem.isNegotiable) {
        _filter.minSalary = null;
        _filter.maxSalary = null;
        _filter.isNegotiateSalary = true;
      } else if (salaryOptionItem) {
        _filter.minSalary = salaryOptionItem.min;
        _filter.maxSalary = salaryOptionItem.max;
      }
    } else {
      _filter.minSalary = null;
      _filter.maxSalary = null;
    }
    const res = await RecruitmentService.jobList({
      ..._.omit(_filter, ["salaryValue", "fetch"]),
      keyword: trim(_filter.keyword),
      stateIds: _filter.stateIds ? [_filter.stateIds] : null,
      workingTypeIds: _filter.workingTypeIds ? [_filter.workingTypeIds] : null,
      literacyIds: _filter.literacyIds ? [_filter.literacyIds] : null,
      experienceIds: _filter.experienceIds ? [_filter.experienceIds] : null,
      jobLevelIds: _filter.jobLevelIds ? [_filter.jobLevelIds] : null,
      orderBy: _filter.orderBy || null,
    });
    if (res?.data?.success) {
      return res?.data;
    }
    return null;
  };

  const { data, status, refetch } = useQuery({ queryKey: ["jobList", filter, profile?.userId], queryFn: fetchData });

  return (
    <div className="pb-20">
      <Container size="xl">
        <div>
          <Breadcrumbs
            data={[
              {
                href: `/`,
                title: t("Home"),
              },
              {
                title: t("Jobs"),
              },
            ]}
          />
        </div>
      </Container>
      <div
        style={{
          background: "url('/images/bg-search-bar.png'),linear-gradient(90deg, #090C79 0%, #0B90F9 100%, #A0D5FF 100%)",
        }}
      >
        <Container size="xl">
          <div className="py-3 grid gap-2 lg:grid-cols-[auto_270px_200px_120px]">
            <TextInput
              onKeyDown={(event: any) => {
                if (event && event.key === "Enter") {
                  setFilter((prev) => ({ ...prev, pageIndex: 1, keyword: event.target.value }));
                }
              }}
              onBlur={(event: any) =>
                setFilter((prev) => ({
                  ...prev,
                  pageIndex: 1,
                  keyword: (document.getElementById("search-keyword") as any)?.value,
                }))
              }
              id="search-keyword"
              placeholder={t("Find jobs")}
              classNames={{
                rightSection: "text-sm placeholder:text-[#888]",
                input: "text-sm",
              }}
              size="md"
              rightSection={<Search color="#4C1CDA" />}
            />
            <MultiSelect
              size="md"
              clearable
              placeholder={t("All industries")}
              data={industryOptions}
              classNames={{
                value: "hidden",
                icon: "justify-start w-auto pl-4 text-[#111] right-[50px]",
                item: "text-sm p-2 mb-1",
                input: "!pl-4",
                searchInput: "placeholder:text-sm",
              }}
              icon={
                <div className="overflow-hidden text-sm flex gap-2 items-center">
                  {filter.industryIds?.[0] ? (
                    <div className="rounded-xl h-[24px] px-2 flex items-center justify-center bg-[#E6E6E6]">
                      <TextLineCamp>
                        {industryOptions.find((option) => option.value === filter.industryIds?.[0])?.label}
                      </TextLineCamp>
                    </div>
                  ) : null}
                  {filter.industryIds?.length > 1 ? (
                    <div className="rounded-xl flex-none h-[24px] px-2 flex items-center justify-center bg-[#E6E6E6]">
                      +{filter.industryIds.length - 1}
                    </div>
                  ) : null}
                </div>
              }
              disableSelectedItemFiltering
              onChange={(value) =>
                setFilter((prev) => ({
                  ...prev,
                  pageIndex: 1,
                  industryIds: value,
                }))
              }
              value={filter.industryIds}
            />
            <Select
              classNames={{
                item: "text-sm p-2 mb-1",
                input: "text-sm",
              }}
              searchable
              clearable
              data={stateVNOptionsWithAll}
              size="md"
              placeholder={t("All provinces")}
              onChange={(value) =>
                setFilter((prev) => ({
                  ...prev,
                  pageIndex: 1,
                  stateIds: +value || null,
                }))
              }
              value={isNil(filter.stateIds) ? null : _.toString(filter.stateIds)}
            />
            <Button size="md" className="px-2 border-[#fff] text-base bg-[#2B31CF]" onClick={() => refetch()}>
              {t("Search")}
            </Button>
          </div>
        </Container>
      </div>
      <Container size="xl">
        <div className="rounded-b-md bg-white overflow-hidden shadow-md">
          <div className="text-sm gap-2 p-4 grid lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_auto] items-center">
            {/*<div className="text-gray-500">{t("Advanced filter")}:</div>*/}
            <Select
              classNames={{
                item: "text-sm p-2 mb-1",
                input: "text-sm text-ellipsis",
              }}
              searchable
              data={experienceOptionsWithAll}
              size="sm"
              placeholder={t("All experience")}
              onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, experienceIds: +value || null }))}
              value={isNil(filter.experienceIds) ? null : _.toString(filter.experienceIds)}
            />
            <Select
              classNames={{
                item: "text-sm p-2 mb-1",
                input: "text-sm text-ellipsis",
              }}
              searchable
              data={salaryOptionsWithAll}
              placeholder={t("All salaries")}
              size="sm"
              onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, salaryValue: +value || null }))}
              value={isNil(filter.salaryValue) ? null : _.toString(filter.salaryValue)}
            />
            <Select
              classNames={{
                item: "text-sm p-2 mb-1",
                input: "text-sm text-ellipsis",
              }}
              searchable
              data={jobLevelOptionsWithAll}
              size="sm"
              placeholder={t("All levels")}
              onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, jobLevelIds: +value || null }))}
              value={isNil(filter.jobLevelIds) ? null : _.toString(filter.jobLevelIds)}
            />
            <Select
              classNames={{
                item: "text-sm p-2 mb-1",
                input: "text-sm text-ellipsis",
              }}
              searchable
              data={literacyOptionsWithAll}
              size="sm"
              placeholder={t("All educational levels")}
              onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, literacyIds: +value || null }))}
              value={isNil(filter.literacyIds) ? null : _.toString(filter.literacyIds)}
            />
            <Select
              classNames={{
                item: "text-sm p-2 mb-1",
                input: "text-sm text-ellipsis",
              }}
              searchable
              data={workingTypeOptionsWithAll}
              size="sm"
              placeholder={t("Job type")}
              onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, workingTypeIds: +value || null }))}
              value={isNil(filter.workingTypeIds) ? null : _.toString(filter.workingTypeIds)}
            />
            <Select
              classNames={{
                item: "text-sm p-2 mb-1",
                input: "text-sm text-ellipsis",
              }}
              searchable
              data={genderOptionsWithAll}
              size="sm"
              placeholder={t("All genders")}
              onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, genderId: +value || null }))}
              value={isNil(filter.genderId) ? null : _.toString(filter.genderId)}
            />
            <div
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  pageIndex: 1,
                  literacyIds: null,
                  salaryValue: null,
                  workingTypeIds: null,
                  jobLevelIds: null,
                  experienceIds: null,
                  genderId: null,
                }))
              }
              className="cursor-pointer font-semibold text-blue-primary px-1 py-2"
            >
              {t("Deselect")}
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-4 flex-wrap mt-5 font-semibold text-lg lg:text-xl">
          <div>{t("{{count}} job(s) matched", { count: data?.metaData?.total || 0 })}</div>
          <div className="flex flex-wrap lg:flex-row flex-col gap-y-2 text-sm lg:divide-x">
            <Link href={"/company"} className="px-2 text-blue-primary cursor-pointer hover:underline">
              {t("Search company")}
            </Link>
            {isManager && (
              <>
                <Link href={"/job/management"} className="px-2 text-blue-primary cursor-pointer hover:underline">
                  {t("Job management")}
                </Link>
                <Link href={"/company/management"} className="px-2 text-blue-primary cursor-pointer hover:underline">
                  {t("Company management")}
                </Link>
                <Link href={"/candidate"} className="px-2 text-blue-primary cursor-pointer hover:underline">
                  {t("List candidate")}
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 my-3">
          <div>{t("Job.SortBy")}:</div>
          <div className="inline-grid grid-cols-2 lg:grid-cols-4 gap-2 items-center">
            {[
              {
                label: t("Recommendation"),
                value: 0,
              },
              {
                label: t("Job.Hot"),
                value: 1,
              },
              {
                label: t("Latest job"),
                value: 2,
              },
              {
                label: t("Highest salary"),
                value: 3,
              },
            ].map((e) => (
              <Badge
                color="gray"
                radius="sm"
                key={e.value}
                // variant="outline"
                onClick={() => {
                  setFilter((prev) => ({
                    ...prev,
                    pageIndex: 1,
                    orderBy: e.value,
                  }));
                }}
                className={clsx(
                  "cursor-pointer p-3 relative border border-transparent normal-case text-sm font-semibold bg-[#FAFAFF] text-[#333] overflow-hidden",
                  {
                    "border-[#3F25D6]": e.value === filter.orderBy,
                  }
                )}
              >
                {e.label}
                {e.value === filter.orderBy && (
                  <Image src="/images/check-button.svg" width={20} height={20} className="absolute bottom-0 right-0" />
                )}
              </Badge>
            ))}
          </div>
        </div>
        {token && (
          <div className="inline-grid grid-cols-2 lg:grid-cols-4 gap-2 items-center">
            {[
              {
                label: t("Saved jobs"),
                value: "bookmarked",
              },
              {
                label: t("Applied jobs"),
                value: "applied",
              },
            ].map((e) => (
              <Badge
                color="gray"
                radius="sm"
                key={e.value}
                // variant="outline"
                onClick={() => {
                  let isApplied = filter.isApplied;
                  if (isApplied && e.value === "applied") {
                    isApplied = null;
                  } else {
                    isApplied = e.value === "applied";
                  }
                  let isBookmarked = filter.isBookmarked;
                  if (isBookmarked && e.value === "bookmarked") {
                    isBookmarked = null;
                  } else {
                    isBookmarked = e.value === "bookmarked";
                  }
                  setFilter((prev) => ({
                    ...prev,
                    pageIndex: 1,
                    isApplied,
                    isBookmarked,
                  }));
                }}
                className={clsx(
                  "cursor-pointer p-3 relative border border-transparent normal-case text-sm font-semibold bg-[#FAFAFF] text-[#333] overflow-hidden",
                  {
                    "border-[#3F25D6]":
                      (filter.isApplied && e.value === "applied") || (filter.isBookmarked && e.value === "bookmarked"),
                  }
                )}
              >
                {e.label}
                {e.value === filter.orderBy && (
                  <Image src="/images/check-button.svg" width={20} height={20} className="absolute bottom-0 right-0" />
                )}
              </Badge>
            ))}
          </div>
        )}
        <div className="mt-5 grid">
          {/*gap-5 lg:grid-cols-[auto_272px]*/}
          <div>
            <div className="flex flex-col gap-4">
              {data?.data?.map((item) => (
                <JobItem data={item} key={item.id} refetch={refetch} />
              ))}
            </div>
            {!!data?.data?.length && (
              <div className="mt-8 pb-8 flex justify-center">
                <Pagination
                  withEdges
                  value={filter.pageIndex}
                  total={data.metaData.pageTotal}
                  onChange={(page) => {
                    setFilter((prev) => ({
                      ...prev,
                      pageIndex: page,
                    }));
                  }}
                />
              </div>
            )}
            {status === "success" && !data?.data?.length && (
              <Text className="p-12 bg-white text-center text-gray-secondary">{t("No results found")}</Text>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Jobs;
