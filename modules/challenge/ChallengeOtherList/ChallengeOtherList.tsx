import { Breadcrumbs } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Flex, Group, Pagination, Text, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Container } from "@src/components";
import CodingService from "@src/services/Coding/CodingService";
import { trim } from "lodash";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { Calendar } from "tabler-icons-react";
import OtherChallengeItem from "./components/OtherChallengeItem";

const ChallengeOtherList = () => {
  const { t } = useTranslation();

  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetch = async () => {
    const res = await CodingService.challengeList({
      ...filter,
      textSearch: trim(filter.textSearch),
    });
    setIsLoading(false);
    const message = res?.data?.message;
    if (res?.data?.success) {
      const data = res.data?.data;
      setData(data);
      return;
    } else if (message) {
      Notify.error(t(message));
    }
    setData(null);
  };

  useEffect(() => {
    fetch();
  }, [filter]);

  return (
    <div className="pb-20">
      <Container size="lg">
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                title: t("All challenges"),
              },
            ]}
          />
        </Flex>

        <div className="flex gap-5 lg:flex-row flex-col justify-between items-center">
          <div className="flex gap-1">
            <Text className="my-0 text-[26px] font-bold text-[#1e266d]"> {t("All challenges")}</Text>
            <Text className="my-0 text-[26px] font-bold text-[#1e266d]"> ({data?.rowCount})</Text>
          </div>
          <div className="max-w-[600px] w-full flex-grow grid gap-5 grid-cols-1 lg:grid-cols-[4fr_6fr]">
            <TextInput
              placeholder={t("Challenge Name")}
              classNames={{ input: "text-sm" }}
              id="search-keyword"
              onKeyDown={(event: any) => {
                if (event && event.key === "Enter") {
                  setFilter((prev) => ({ ...prev, pageIndex: 1, textSearch: event.target.value }));
                }
              }}
              onBlur={(event: any) =>
                setFilter((prev) => ({
                  ...prev,
                  pageIndex: 1,
                  textSearch: (document.getElementById("search-keyword") as any)?.value,
                }))
              }
            />
            <div className="grid gap-2 lg:gap-5 items-center grid-cols-[1fr_1fr]">
              <DatePickerInput
                placeholder={t("Start Date")}
                clearable
                valueFormat="DD/MM/YYYY"
                decadeLabelFormat="DD/MM/YYYY"
                value={filter.startTime}
                onChange={(date) => setFilter((prev) => ({ ...prev, pageIndex: 1, startTime: date }))}
                classNames={{ placeholder: "text-sm", input: "text-sm" }}
                icon={<Calendar color="#999" />}
              />
              <DatePickerInput
                placeholder={t("End Date")}
                clearable
                valueFormat="DD/MM/YYYY"
                decadeLabelFormat="DD/MM/YYYY"
                value={filter.endTime}
                onChange={(date) => setFilter((prev) => ({ ...prev, pageIndex: 1, endTime: date }))}
                classNames={{ placeholder: "text-sm", input: "text-sm" }}
                icon={<Calendar color="#999" />}
              />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5">
          {data?.results?.map((item) => (
            <OtherChallengeItem key={item.id} data={item} />
          ))}
        </div>

        {data?.pageCount > 0 && (
          <Group position="center" my="xl">
            <Pagination
              withEdges
              value={filter.pageIndex}
              onChange={(pageIndex) => setFilter((prev) => ({ ...prev, pageIndex }))}
              total={data?.pageCount}
            />
          </Group>
        )}
      </Container>
    </div>
  );
};

export default ChallengeOtherList;
