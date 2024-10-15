import { Text } from "@edn/components";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Image, Progress, Select } from "@mantine/core";
import Link from "@src/components/Link";
import LabelCreated from "@src/components/PinBadge/LabelCreated";
import StarRatings from "@src/components/StarRatings";
import { LearnCourseService } from "@src/services";
import { selectProfile } from "@src/store/slices/authSlice";
import { useQuery } from "@tanstack/react-query";
import { Trans, useTranslation } from "next-i18next";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, Users } from "tabler-icons-react";

const BoxCourse = (props: any) => {
  const { userId, isShowContributor } = props;

  const { t } = useTranslation();

  const profile = useSelector(selectProfile);
  const isCurrentUser = profile && profile?.userId === userId;

  const [filter, setFilter] = useState({ pageIndex: 1, pageSize: 3, courseState: 2 });

  const { data, status } = useQuery({
    queryKey: ["getMyCourses", filter, userId, isShowContributor],
    queryFn: () => fetch(),
  });

  const fetch = async () => {
    if (!userId) return null;
    const res = await LearnCourseService.getMyCourses({
      ...filter,
      userId,
      courseState: isShowContributor ? 1 : filter.courseState,
    });
    return res?.data?.data;
  };

  return (
    <div className="bg-white rounded-md shadow-md p-5 relative">
      {filter.pageIndex > 1 && (
        <ActionIcon
          className="absolute z-10 top-1/2 active:-translate-y-[calc(50%_-_1px)] -translate-y-1/2 -translate-x-1/2 left-0"
          variant="filled"
          size="sm"
          radius="xl"
          color="#2A37C7"
          onClick={() => setFilter((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
        >
          <ChevronLeft />
        </ActionIcon>
      )}
      {data && filter.pageIndex < data.pageCount ? (
        <ActionIcon
          className="absolute z-10 top-1/2 active:-translate-y-[calc(50%_-_1px)] -translate-y-1/2 translate-x-1/2 right-0"
          variant="filled"
          size="sm"
          radius="xl"
          color="#2A37C7"
          onClick={() => setFilter((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
        >
          <ChevronRight />
        </ActionIcon>
      ) : null}

      <div className="flex justify-between gap-4 items-center ">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-lg uppercase">
            {t(isShowContributor ? "Created course" : "Learning")}
          </span>
          <span className="text-sm">({data?.rowCount})</span>
        </div>
        {!isShowContributor && status === "success" && (
          <Select
            classNames={{ input: "border-none text-right pr-7", root: "w-[120px]" }}
            data={[
              { value: "2", label: t("Registered") },
              { value: "3", label: t("Completed") },
            ]}
            onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, courseState: +value }))}
            value={filter.courseState?.toString()}
          />
        )}
      </div>

      {data?.results?.length > 0 ? (
        <div className="mt-3 grid gap-4 lg:grid-cols-3">
          {data.results.map((item) => (
            <CourseItem data={item} key={item.id} />
          ))}
        </div>
      ) : (
        <div className="mt-4 mb-5 text-center">
          {isCurrentUser && !isShowContributor ? (
            <Trans i18nKey="EMPTY_COURSE_LINKING" t={t}>
              Bạn chưa tham gia khóa học nào, ấn
              <Link href={"/learning"} className="text-blue-primary">
                vào đây
              </Link>
              để tham gia ngay.
            </Trans>
          ) : (
            <Text className="text-gray-secondary">{t("No results found")}</Text>
          )}
        </div>
      )}
    </div>
  );
};

export default BoxCourse;
const numberFormat = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });

const CourseItem = (props: { data: any }) => {
  const { data } = props;

  return (
    <Link href={`/learning/${data.permalink}`}>
      <div className="rounded-md shadow-md border relative overflow-hidden">
        <div className="relative">
          {data.isCreated && (
            <div className="absolute top-[-4.4px] left-[-4.4px] z-100">
              <LabelCreated />
            </div>
          )}
          <div className="absolute z-100 bottom-0 right-[30px]">
            {/*<RingProgress*/}
            {/*  label={*/}
            {/*    <div className="flex items-center justify-center">*/}
            {/*      <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} fill="none">*/}
            {/*        <g clipPath="url(#a)">*/}
            {/*          <path*/}
            {/*            fill="gray"*/}
            {/*            d="M3.303.265C2.22-.356 1.343.152 1.343 1.399v9.2c0 1.249.878 1.757 1.96 1.137l8.042-4.612c1.082-.621 1.082-1.627 0-2.247L3.303.264Z"*/}
            {/*          />*/}
            {/*        </g>*/}
            {/*        <defs>*/}
            {/*          <clipPath id="a">*/}
            {/*            <path fill="#fff" d="M0 0h12v12H0z" />*/}
            {/*          </clipPath>*/}
            {/*        </defs>*/}
            {/*      </svg>*/}
            {/*    </div>*/}
            {/*  }*/}
            {/*  rootColor="#C8C8C8"*/}
            {/*  sections={[{ value: 40, color: "green" }]}*/}
            {/*/>*/}
          </div>
          <Image
            src={data.thumbnail}
            height="auto"
            withPlaceholder
            placeholder=" "
            width="100%"
            classNames={{ image: "aspect-[340/220] object-contain" }}
            className="rounded-t-md overflow-hidden aspect-[340/220]"
            alt="course"
          />
        </div>
        <div className="px-3 pt-2 pb-3">
          <TextLineCamp className="text-lg text-[#2C31CF] font-semibold">{data.title}</TextLineCamp>
          <div className="text-sm flex items-center gap-3 justify-between">
            <StarRatings size="sm" rating={data.averageRate} />
            <div className="flex items-center gap-1 ">
              <Users width={16} color="#C8C8C8" />
              <span>{numberFormat.format(data.totalEnroll)}</span>
            </div>
            <span>{numberFormat.format(data.progress)}%</span>
          </div>
        </div>
        {data.isEnroll && (
          <div className="absolute bottom-0 right-0 left-0">
            <Progress
              classNames={{
                bar: "bg-[#0AD0DA]",
                root: "bg-[#B5F1F4]",
              }}
              size="6px"
              radius="0"
              striped
              value={data.progress}
            />
          </div>
        )}
      </div>
    </Link>
  );
};
