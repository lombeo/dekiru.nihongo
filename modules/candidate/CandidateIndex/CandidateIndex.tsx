import { Breadcrumbs, Text } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Button, MultiSelect, Pagination, Select, Table } from "@mantine/core";
import { Container } from "@src/components";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import useCountries from "@src/hooks/useCountries";
import useIsManagerRecruitment from "@src/hooks/useIsManagerRecruitment";
import useRecruitmentMasterData from "@src/hooks/useRecruitmentMasterData";
import CandidateItem from "@src/modules/candidate/CandidateIndex/components/CandidateItem";
import ModalAddToGroup from "@src/modules/candidate/CandidateIndex/components/ModalAddToGroup";
import { RecruitmentService } from "@src/services/RecruitmentService/RecruitmentService.ts";
import { useQuery } from "@tanstack/react-query";
import _, { isNil } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "./CandidateIndex.module.scss";

const CandidateIndex = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { stateVNOptionsWithAll } = useCountries();

  const [groups, setGroups] = useState([]);

  const [openModalAddToGroup, setOpenModalAddToGroup] = useState(false);

  const refSelected = useRef<any>(null);

  const fetchGroups = async () => {
    const res = await RecruitmentService.groupList({
      pageSize: 0,
    });
    if (res?.data?.success) {
      setGroups(res.data.data);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const {
    industryOptions,
    workingTypeOptionsWithAll,
    salaryOptionsWithAll,
    literacyOptionsWithAll,
    experienceOptionsWithAll,
    jobLevelOptionsWithAll,
    foreignLanguageOptions,
  } = useRecruitmentMasterData();

  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
    keyword: "",
  });

  const { data, refetch, status } = useQuery({
    queryKey: ["candidateSearch", filter],
    queryFn: async () => {
      try {
        const res = await RecruitmentService.candidateSearch(filter);
        return res.data;
      } catch (e) {}
      return null;
    },
  });

  const handleExport = async () => {
    const res = await RecruitmentService.candidateExport(filter);
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

  const { isManager, loading } = useIsManagerRecruitment();

  useEffect(() => {
    if (!loading && !isManager) {
      router.push("/403");
    }
  }, [isManager, loading]);

  if (loading || !isManager) return null;

  return (
    <div className="pb-20">
      {openModalAddToGroup && (
        <ModalAddToGroup
          onSuccess={refetch}
          groups={groups}
          data={refSelected.current}
          onClose={() => setOpenModalAddToGroup(false)}
        />
      )}
      <Container size="xl">
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              href: `/job`,
              title: t("Recruitment"),
            },
            {
              title: t("List candidate"),
            },
          ]}
        />
      </Container>
      <div
        style={{
          background: "url('/images/bg-search-bar.png'),linear-gradient(90deg, #090C79 0%, #0B90F9 100%, #A0D5FF 100%)",
        }}
      >
        <Container size="xl">
          <div className="text-sm gap-2 py-4 grid md:grid-cols-2 lg:grid-cols-5 items-center">
            <MultiSelect
              size="sm"
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
              data={groups?.map((e) => ({ label: e.name, value: _.toString(e.id) }))}
              size="sm"
              placeholder={t("All groups")}
              onChange={(value) =>
                setFilter((prev) => ({
                  ...prev,
                  pageIndex: 1,
                  groupIds: +value || null,
                }))
              }
              value={isNil(filter.groupIds) ? null : _.toString(filter.groupIds)}
            />
            <Select
              classNames={{
                item: "text-sm p-2 mb-1",
                input: "text-sm text-ellipsis",
              }}
              searchable
              data={foreignLanguageOptions}
              clearable
              size="sm"
              placeholder={t("Language")}
              onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, foreignLanguages: +value || null }))}
              value={isNil(filter.foreignLanguages) ? null : _.toString(filter.foreignLanguages)}
            />
            <Select
              classNames={{
                item: "text-sm p-2 mb-1",
                input: "text-sm",
              }}
              searchable
              clearable
              data={stateVNOptionsWithAll}
              size="sm"
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
            <Select
              classNames={{
                item: "text-sm p-2 mb-1",
                input: "text-sm text-ellipsis",
              }}
              searchable
              clearable
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
              clearable
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
              clearable
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
              clearable
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
              clearable
              data={workingTypeOptionsWithAll}
              size="sm"
              placeholder={t("Job type")}
              onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, workingTypeIds: +value || null }))}
              value={isNil(filter.workingTypeIds) ? null : _.toString(filter.workingTypeIds)}
            />
            {/*<div*/}
            {/*  onClick={() =>*/}
            {/*    setFilter((prev) => ({*/}
            {/*      ...prev,*/}
            {/*      pageIndex: 1,*/}
            {/*      literacyIds: null,*/}
            {/*      salaryValue: null,*/}
            {/*      workingTypeIds: null,*/}
            {/*      jobLevelIds: null,*/}
            {/*      experienceIds: null,*/}
            {/*      genderId: null,*/}
            {/*      groupIds: null,*/}
            {/*      stateIds: null,*/}
            {/*      industryIds: null,*/}
            {/*      foreignLanguages: null,*/}
            {/*    }))*/}
            {/*  }*/}
            {/*  className="cursor-pointer text-white px-1 py-2 font-semibold"*/}
            {/*>*/}
            {/*  {t("Deselect")}*/}
            {/*</div>*/}
          </div>
        </Container>
      </div>
      <Container size="xl">
        <div className="flex justify-end gap-4 my-4">
          <Button color="blue" onClick={() => router.push("/candidate/group")}>
            {t("List group")}
          </Button>
          <Button className="bg-[#084DB1]" onClick={handleExport}>
            {t("SHORT_EXPORT")}
          </Button>
        </div>
        <div className="overflow-auto">
          <Table className={styles.table} captionSide="bottom" withBorder>
            <thead>
              <tr>
                <th className="!text-center w-[60px]">{t("No.")}</th>
                <th>{t("User")}</th>
                <th>{t("CV")}</th>
                <th>{t("Industry")}</th>
                <th>{t("Years of experience")}</th>
                <th className="!text-right">
                  {t("Salary")}&nbsp;({t("million")})
                </th>
                <th>{t("Workplace")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((e: any, index) => (
                <CandidateItem
                  onAddToGroup={() => {
                    refSelected.current = e;
                    setOpenModalAddToGroup(true);
                  }}
                  data={e}
                  index={filter.pageSize * (filter.pageIndex - 1) + index + 1}
                  key={e.id}
                />
              ))}
            </tbody>
          </Table>
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
      </Container>
    </div>
  );
};

export default CandidateIndex;
