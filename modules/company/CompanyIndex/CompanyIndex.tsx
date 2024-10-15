import { Text } from "@edn/components";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Button, MultiSelect, Pagination, Select, TextInput } from "@mantine/core";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import useCountries from "@src/hooks/useCountries";
import useIsManagerRecruitment from "@src/hooks/useIsManagerRecruitment";
import useRecruitmentMasterData from "@src/hooks/useRecruitmentMasterData";
import CompanyItem from "@src/modules/company/CompanyIndex/components/CompanyItem";
import { RecruitmentService } from "@src/services/RecruitmentService";
import { useQuery } from "@tanstack/react-query";
import _, { cloneDeep, isNil, trim } from "lodash";
import { Trans, useTranslation } from "next-i18next";
import { useState } from "react";
import { Search } from "tabler-icons-react";

const CompanyIndex = () => {
  const { t } = useTranslation();

  const [filter, setFilter] = useState<any>({ pageIndex: 1, pageSize: 16 });

  const { isManager } = useIsManagerRecruitment();

  const { stateVNOptionsWithAll } = useCountries();

  const { industryOptions, companySizeOptionsWithAll } = useRecruitmentMasterData();

  const fetchData = async () => {
    const _filter = cloneDeep(filter);
    const res = await RecruitmentService.companyList({
      ..._.omit(_filter, ["salaryValue", "fetch"]),
      keyword: trim(_filter.keyword),
      stateIds: _filter.stateIds ? [_filter.stateIds] : null,
    });
    if (res?.data?.success) {
      return res?.data;
    }
    return null;
  };

  const { data, status, refetch } = useQuery({ queryKey: ["companyList", filter], queryFn: fetchData });

  return (
    <div className="pb-20">
      <div style={{ background: "linear-gradient(90deg, #090C79 0%, #0B90F9 100%, #A0D5FF 100%)" }}>
        <Container size="xl">
          <div className="py-5 grid gap-2 lg:grid-cols-[1fr_1fr_1fr_1fr_120px]">
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
              placeholder={t("Search...")}
              classNames={{
                rightSection: "text-sm placeholder:text-[#888]",
                input: "text-sm",
              }}
              size="lg"
              rightSection={<Search color="#4C1CDA" />}
            />
            <Select
              classNames={{
                item: "text-sm p-2 mb-1",
                input: "text-sm",
              }}
              searchable
              clearable
              data={stateVNOptionsWithAll}
              size="lg"
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
            <MultiSelect
              size="lg"
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
              data={companySizeOptionsWithAll}
              size="lg"
              placeholder={t("All company size")}
              onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, companySizeIds: +value || null }))}
              value={isNil(filter.companySizeIds) ? null : _.toString(filter.companySizeIds)}
            />
            <Button size="lg" className="px-2 border-[#fff] text-base bg-[#2B31CF]" onClick={() => refetch()}>
              {t("Search")}
            </Button>
          </div>
        </Container>
      </div>
      <Container size="xl">
        <div className="flex justify-between gap-4 flex-wrap mt-5 font-semibold">
          <div>
            <Trans i18nKey="CompanyPage.TOTAL" t={t} values={{ count: data?.metaData?.total || 0 }}>
              Found <span className="text-[#2C31CF]">0</span> công ty phù hợp với yêu cầu của bạn
            </Trans>
          </div>
          {isManager && (
            <Link href={"/company/management"} className="text-blue-primary cursor-pointer hover:underline">
              {t("Company management")}
            </Link>
          )}
        </div>

        <div className="mt-5">
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-5">
            {data?.data?.map((item) => (
              <CompanyItem data={item} key={item.id} />
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
      </Container>
    </div>
  );
};

export default CompanyIndex;
