import { Text } from "@edn/components";
import { Pagination } from "@mantine/core";
import JobItem from "@src/modules/job/JobDetail/components/JobItem";
import { RecruitmentService } from "@src/services/RecruitmentService";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useState } from "react";

const BoxRecommend = (props: any) => {
  const { t } = useTranslation();
  const { jobId } = props;

  const [filter, setFilter] = useState({ pageIndex: 1, pageSize: 10 });

  const { data, status } = useQuery({
    queryKey: ["jobRecommend", jobId, filter],
    queryFn: async () => {
      if (!jobId) return null;
      const res = await RecruitmentService.jobRecommend({
        ...filter,
        jobId,
      });
      return res?.data;
    },
  });

  return (
    <div className="rounded-md shadow-md bg-white p-5">
      <div className="font-semibold text-xl mb-5 text-[#FF4D00]">{t("Similar jobs")}</div>
      <div className="flex flex-col gap-4">
        {data?.data?.map((item) => (
          <JobItem data={item} key={item.id} />
        ))}
      </div>
      {!!data?.data?.length && (
        <div className="mt-8 pb-4 flex justify-center">
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
  );
};

export default BoxRecommend;
