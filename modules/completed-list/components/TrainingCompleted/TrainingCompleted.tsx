import { Group } from "@edn/components";
import Icon from "@edn/font-icons/icon";
import { Loader, Pagination, Text, TextInput } from "@mantine/core";
import { NotFound } from "@src/components/Svgr/components";
import CodingService from "@src/services/Coding/CodingService";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import TrainingCompletedItem from "./components/TraningCompletedItem";

export default function TrainingCompleted(props: any) {
  const { id } = props;
  const [filter, setFilter] = useState({
    textSearch: "",
    pageIndex: 1,
  });
  const [data, setData] = useState({} as any);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const fetch = async () => {
    setIsLoading(true);
    const res = await CodingService.getUserCompletedTraining({
      textSearch: filter.textSearch,
      pageIndex: 1,
      pageSize: 20,
      userId: id,
    });
    if (res?.data?.success) {
      setData(res.data.data);
    } else {
      setData(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [filter]);

  return (
    <div>
      <div className="mt-4">
        <Group>
          <TextInput
            placeholder={t("Search")}
            className="max-w-[500px] w-full"
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
            icon={<Icon name="search" size={20} className="text-gray" />}
          />
        </Group>
        <div>
          {!isLoading ? (
            data?.results?.length > 0 ? (
              <div className="mt-5 grid lg:grid-cols-4 grid-cols-1 gap-[20px]">
                {data.results.map((item) => {
                  return <TrainingCompletedItem key={item.id} data={item} />;
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center mb-10 bg-white py-10 mt-10">
                <NotFound height={199} width={350} />
                <Text mt="lg" size="lg" fw="bold">
                  {t("No result found")}
                </Text>
              </div>
            )
          ) : (
            <div className="mt-20 flex justify-center">
              <Loader color="blue" />
            </div>
          )}
        </div>
        {data?.results?.length > 0 && (
          <Group position="center" className="mt-6">
            <Pagination
              withEdges
              value={filter.pageIndex}
              total={Math.ceil(data?.rowCount / 20)}
              onChange={(pageIndex) => setFilter((prev) => ({ ...prev, pageIndex }))}
            />
          </Group>
        )}
      </div>
    </div>
  );
}
