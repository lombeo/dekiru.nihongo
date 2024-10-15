import { Pagination, Text } from "@edn/components";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Badge, Group, Image, Select } from "@mantine/core";
import Link from "@src/components/Link";
import LabelCreated from "@src/components/PinBadge/LabelCreated";
import { CDN_URL } from "@src/config";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import CodingService from "@src/services/Coding/CodingService";
import { selectProfile } from "@src/store/slices/authSlice";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { Trans, useTranslation } from "next-i18next";
import { useState } from "react";
import { useSelector } from "react-redux";
import { User, Users } from "tabler-icons-react";

const BoxContest = (props: any) => {
  const { userId, isShowContributor } = props;

  const { t } = useTranslation();

  const profile = useSelector(selectProfile);
  const isCurrentUser = profile && profile?.userId === userId;

  const [filter, setFilter] = useState({ pageIndex: 1, pageSize: 5, state: 2 });

  const { data, status } = useQuery({
    queryKey: ["contestGetProfileContestList", filter, userId, isShowContributor],
    queryFn: () => fetch(),
  });

  const fetch = async () => {
    if (!userId) return null;
    const res = await CodingService.contestGetProfileContestList({
      ...filter,
      userId,
      state: isShowContributor ? 1 : filter.state,
    });
    return res?.data;
  };

  return (
    <div className="bg-white rounded-md shadow-md p-5 relative">
      <div className="flex justify-between gap-4 items-center ">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-lg uppercase">{t(isShowContributor ? "Contest created" : "fights")}</span>
          <span className="text-sm">({data?.metaData?.total})</span>
        </div>
        {!isShowContributor && status === "success" && data?.data?.length > 0 && (
          <Select
            classNames={{ input: "border-none text-right pr-7", root: "w-[140px]" }}
            data={[
              { value: "2", label: t("Joined") },
              { value: "3", label: t("Finished") },
            ]}
            onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, state: +value }))}
            value={filter.state?.toString()}
          />
        )}
      </div>
      {data?.data?.length > 0 ? (
        <div className="flex flex-col gap-4 mb-5 mt-4">
          {data.data.map((item) => (
            <ContestItem data={item} key={item.contestId} />
          ))}
        </div>
      ) : (
        <div className="mt-4 mb-5 text-center">
          {isCurrentUser && !isShowContributor ? (
            <Trans i18nKey="EMPTY_CONTEST_LINKING" t={t}>
              Bạn chưa tham gia cuộc thi nào, ấn
              <Link href={"/fights"} className="text-blue-primary">
                vào đây
              </Link>
              để tham gia ngay.
            </Trans>
          ) : (
            <Text className="text-gray-secondary">{t("No results found")}</Text>
          )}
        </div>
      )}
      {data?.data?.length > 0 && (
        <Group position="center">
          <Pagination
            pageIndex={filter.pageIndex}
            currentPageSize={data.data?.length}
            totalItems={data.metaData.total}
            totalPages={data.metaData.pageTotal}
            label={""}
            pageSize={filter.pageSize}
            onChange={(pageIndex) => setFilter((prev) => ({ ...prev, pageIndex }))}
          />
        </Group>
      )}
    </div>
  );
};

export default BoxContest;

const ContestItem = (props: any) => {
  const { data } = props;

  const { t } = useTranslation();

  const getStatusStr = (status: string, isJoined: boolean) => {
    switch (status) {
      case "CONTEST_TO_START_REGISTER":
        if (isJoined) {
          return t("View detail");
        }
        return t("To start register");
      case "CONTEST_TO_END_REGISTER":
        if (isJoined) {
          return t("View detail");
        }
        return t("Register now");
      case "CONTEST_UPCOMING":
        return t("Upcoming");
      case "CONTEST_RUNNING":
        return t("Ongoing");
      case "CONTEST_FINISH":
        return t("fight.Finished");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONTEST_TO_START_REGISTER":
        return "#FD7E14";
      case "CONTEST_TO_END_REGISTER":
        return "#FF5C00";
      case "CONTEST_UPCOMING":
        return "#4d96ff";
      case "CONTEST_RUNNING":
        return "#7bc043";
      case "CONTEST_FINISH":
        return "#5E5A5A";
    }
  };

  const tags = data?.tags?.split(",")?.filter((e) => !isEmpty(e));
  /* Rectangle 1792 */

  // position: absolute;
  // left: 0.33%;
  // right: 0%;
  // top: 3.92%;
  // bottom: 0%;
  //
  // background: ;
  // border: 1px solid #C2C3C5;
  // box-shadow: ;
  // border-radius: 15px;

  return (
    <div
      style={{ backgroundImage: "linear-gradient(180deg, #F0F3F5 0%, #FFFFFF 100%)" }}
      className="shadow-md rounded-xl relative border border-[#E7E5E5]"
    >
      {data.isCreated && (
        <div className="absolute top-[-4.4px] left-[-4.4px] z-100">
          <LabelCreated />
        </div>
      )}
      <div className="rounded-xl overflow-hidden grid lg:grid-cols-[110px_1fr_180px] gap-4 p-4">
        <div className="flex justify-center">
          <Image
            placeholder={t("Image")}
            height={110}
            width={110}
            fit="contain"
            alt=""
            src={
              data && isEmpty(data.icon)
                ? "/default-image.png"
                : data?.icon?.startsWith("http")
                ? data?.icon
                : CDN_URL + data?.icon
            }
            className="rounded-xl overflow-hidden"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Link href={`/fights/detail/${data.contestId}`}>
            <TextLineCamp className="font-semibold text-lg">{data.name}</TextLineCamp>
          </Link>
          <Group>
            {data.isJoined && !data.isNotStarted ? (
              <Group spacing="6px">
                <Image alt="users-alt" src="/images/users-alt.png" width={24} height={24} />
                <div>
                  <strong className="font-[900] text-[#FF5C00]">{data.userRank || "-"}</strong>/{data.totalUsers}
                </div>
              </Group>
            ) : (
              <Group spacing="6px">
                {data?.isForTeam ? <Users width={20} height={20} /> : <User width={20} height={20} />}
                <div className="normal-case text-sm">
                  {data?.totalUsers} {data?.isForTeam ? t("Team") : t("Individual")}
                </div>
              </Group>
            )}
            <Group spacing="6px">
              <Image alt="heart" src="/images/heart.png" width={24} height={24} />
              <strong className="font-[900] text-[#FF5C00]">
                {data.isJoined && !data.isNotStarted ? `${data.point}/${data.maxPoint}` : data.maxPoint}
              </strong>
            </Group>
          </Group>
          <Group spacing="6px" mt="xs">
            {tags?.map((tag) => (
              <Badge key={tag} className="text-[#3E4043] bg-[#F8F8F8]" color="gray" radius="3px">
                {tag}
              </Badge>
            ))}
          </Group>
        </div>

        <div className="flex flex-col h-full justify-center items-center gap-3">
          <div className="text-sm">
            {formatDateGMT(data.startDate)} - {formatDateGMT(data.endDate)}
          </div>
          <div style={{ color: getStatusColor(data.status) }}>{getStatusStr(data.status, data.isJoined)}</div>
        </div>
      </div>
    </div>
  );
};
