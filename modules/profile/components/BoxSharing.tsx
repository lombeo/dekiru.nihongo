import { Pagination } from "@edn/components";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Group, Image } from "@mantine/core";
import Link from "@src/components/Link";
import PinBadge from "@src/components/PinBadge";
import StarRatings from "@src/components/StarRatings";
import { CDN_URL } from "@src/config";
import SharingService from "@src/services/Sharing/SharingService";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { useTranslation } from "next-i18next";
import { useState } from "react";

const BoxSharing = (props: any) => {
  const { userId } = props;

  const { t } = useTranslation();

  const [filter, setFilter] = useState({ pageIndex: 1, pageSize: 6 });

  const { data, status } = useQuery({ queryKey: ["getBlogList", filter, userId], queryFn: () => fetch() });

  const fetch = async () => {
    if (!userId) return null;
    const res = await SharingService.getBlogList({
      ...filter,
      ownerId: userId,
      isCreate: true,
    });
    return res?.data;
  };

  return (
    <div className="bg-white rounded-md shadow-md p-5 relative">
      <div className="flex justify-between gap-4 items-center ">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-lg uppercase">{t("Sharing")}</span>
          <span className="text-sm">({data?.meta?.total})</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-5 mt-4">
        {data?.data?.map((item) => (
          <BlogItem data={item} key={item.contestId} />
        ))}
      </div>

      {data?.data && (
        <Group position="center" mb="lg">
          <Pagination
            pageIndex={filter.pageIndex}
            currentPageSize={data.data?.length}
            totalItems={data.meta.total}
            totalPages={data.meta.totalPage}
            label={""}
            pageSize={filter.pageSize}
            onChange={(pageIndex) => setFilter((prev) => ({ ...prev, pageIndex }))}
          />
        </Group>
      )}
    </div>
  );
};

export default BoxSharing;

const BlogItem = (props: any) => {
  const { data } = props;

  const { t } = useTranslation();

  return (
    <div
      style={{ backgroundImage: "linear-gradient(180deg, #F0F3F5 0%, #FFFFFF 100%)" }}
      className="relative shadow-md rounded-xl border border-[#E7E5E5]"
    >
      <PinBadge isTrending={data.isTopTrending} isNew={data.isLatest} isHot={data.isHot} />
      <div className="rounded-xl overflow-hidden grid lg:grid-cols-[110px_1fr] gap-4 p-4">
        <div className="flex justify-center">
          <Link href={`/sharing/${data.permalink}`}>
            <Image
              placeholder={t("Image")}
              height={110}
              width={110}
              fit="contain"
              alt=""
              src={
                data && isEmpty(data.imageUrl)
                  ? "/default-image.png"
                  : data?.imageUrl?.startsWith("http")
                  ? data?.imageUrl
                  : CDN_URL + data?.imageUrl
              }
              className="rounded-xl overflow-hidden"
            />
          </Link>
        </div>

        <div className="flex flex-col">
          <Link href={`/sharing/${data.permalink}`}>
            <TextLineCamp line={2} className="font-semibold text-lg">
              {data.title}
            </TextLineCamp>
          </Link>
          <StarRatings rating={data?.rateSummary?.avgRate} size="sm" />
          <TextLineCamp line={2} className="">
            {data.description}
          </TextLineCamp>
        </div>
      </div>
    </div>
  );
};
