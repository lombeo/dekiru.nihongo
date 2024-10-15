import { Breadcrumbs, Pagination } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Button, Flex, Group, Image, Select, Text, TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Container } from "@src/components";
import ExternalLink from "@src/components/ExternalLink";
import { NotFound } from "@src/components/Svgr/components";
import UserRole from "@src/constants/roles";
import { useHasAnyRole } from "@src/helpers/helper";
import HotTrainingItem, {
  SkeletonHotTrainingItem,
} from "@src/modules/training/TrainingIndex/componnents/HotTrainingItem";
import TrainingItem, { SkeletonTrainingItem } from "@src/modules/training/TrainingIndex/componnents/TrainingItem";
import CodingService from "@src/services/Coding/CodingService";
import { selectProfile } from "@src/store/slices/authSlice";
import { isNil, toString } from "lodash";
import { useTranslation } from "next-i18next";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Plus, Search } from "tabler-icons-react";

const TrainingIndex = () => {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const profile = useSelector(selectProfile);
  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 16,
    status: -1,
    levelId: -1,
    type: 0,
    suggestType: 0,
    ownerName: "",
    textSearch: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const isManagerTask = useHasAnyRole([UserRole.SiteOwner, UserRole.ManagerContent]);
  const fetch = async () => {
    const res = await CodingService.trainingList({
      ...filter,
      status: filter.status === -1 ? null : filter.status,
      levelId: filter.levelId === -1 ? null : filter.levelId,
      textSearch: filter.textSearch?.trim(),
      ownerName: filter.ownerName?.trim(),
    });
    if (res?.data?.success) {
      setData(res.data?.data);
    } else {
      setData(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [filter]);

  const numberFormat = new Intl.NumberFormat("de-DE");

  const handleHidden = (data: any) => {
    confirmAction({
      message: t("Are you sure you want to hidden task: {{name}}?", {
        name: data?.title,
      }),
      onConfirm: async () => {
        const res = await CodingService.activityHiddenActivity({
          activityId: data?.id,
        });
        if (res?.data?.success) {
          fetch();
          Notify.success(t("Hidden successfully!"));
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
      },
    });
  };

  return (
    <div className="pb-20">
      <Container size="xl">
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                title: t("Training"),
              },
            ]}
          />
        </Flex>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-[calc(75%_-_4px)]  flex-none shadow-md rounded-lg bg-white relative flex flex-col justify-between">
            <Image
              src="/images/training/bg-min.png"
              alt="banner"
              className="rounded-t-lg overflow-hidden"
              width="100%"
              height="auto"
            />
            <div className="absolute lg:bottom-[10px] bottom-[35px] left-[15px]">
              <NextImage
                src="/images/training/ChallengesIcon.svg"
                alt="banner"
                width={isDesktop ? 105 : 30}
                height={isDesktop ? 121 : 36}
              />
            </div>
            <div className="text-white absolute sm:bottom-[75px] bottom-[55px] right-[16px] lg:right-[150px] sm:-translate-x-1/2 flex gap-6">
              <div className="flex flex-col items-center">
                <span
                  style={{
                    textShadow: `-1px -1px 0 #682803, 1px -1px 0 #682803, -1px 1px 0 #682803, 1px 1px 0 #682803`,
                  }}
                  className="md:text-xl text-xs font-[900] text-white"
                >
                  {numberFormat.format(data?.summary?.totalSubmit || 0)}
                </span>
                <span className="md:text-sm text-xs font-semibold italic">{t("TrainingPage.Submissions")}</span>
              </div>
              <div className="flex flex-col items-center">
                <span
                  style={{
                    textShadow: `-1px -1px 0 #682803, 1px -1px 0 #682803, -1px 1px 0 #682803, 1px 1px 0 #682803`,
                  }}
                  className="md:text-xl text-xs font-[900] text-white"
                >
                  {numberFormat.format(data?.summary?.totalUser || 0)}
                </span>
                <span className="md:text-sm text-xs font-semibold italic">{t("Active Users")}</span>
              </div>
            </div>

            <div className="lg:pl-[100px] flex justify-around items-center">
              <div className="lg:px-[40px] py-[14px] text-sm text-[65656D] flex gap-[6px] items-center">
                <span>{t("Easy")}</span>
                <span className="text-[#77c148] font-[900] text-[24px]">
                  {numberFormat.format(data?.summary?.numOfEasySolved || 0)}/
                  {numberFormat.format(data?.summary?.numOfEasyTask || 0)}
                </span>
              </div>
              <div className="lg:px-[40px] py-[14px] text-sm text-[65656D] flex gap-[6px] items-center">
                <span>{t("Medium")}</span>
                <span className="text-[#faa05e] font-[900] text-[24px]">
                  {numberFormat.format(data?.summary?.numOfMediumSolved || 0)}/
                  {numberFormat.format(data?.summary?.numOfMediumTask || 0)}
                </span>
              </div>
            </div>
          </div>
          {isLoading ? (
            <SkeletonHotTrainingItem />
          ) : (
            <HotTrainingItem data={data?.summary?.hottestActivity || data?.activities?.results?.[0]} />
          )}
        </div>

        <div className="grid lg:grid-cols-4 grid-cols-1 gap-4 mt-4">
          <TextInput
            onKeyDown={(event: any) => {
              if (event && event.key === "Enter") {
                setFilter((prev) => ({ ...prev, pageIndex: 1, textSearch: event.target.value }));
              }
            }}
            onBlur={(event) =>
              setFilter((prev) => ({
                ...prev,
                pageIndex: 1,
                textSearch: (document.getElementById("filter-mentor") as any).value,
              }))
            }
            id="filter-mentor"
            className="w-full"
            placeholder={t("Search...")}
            rightSection={<Search color="#2C31CF" width={20} />}
          />

          <div className="grid grid-cols-2 gap-4">
            {profile && (
              <Select
                data={[
                  {
                    label: t("Status"),
                    value: "-1",
                  },
                  {
                    label: t("Completed"),
                    value: "2",
                  },
                  {
                    label: t("Incomplete"),
                    value: "1",
                  },
                  {
                    label: t("Not solved"),
                    value: "0",
                  },
                ]}
                value={isNil(filter.status) ? null : toString(filter.status)}
                onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, status: +value }))}
              />
            )}

            <Select
              data={
                isManagerTask
                  ? [
                      {
                        label: t("Level"),
                        value: "-1",
                      },
                      {
                        label: t("Easy"),
                        value: "1",
                      },
                      {
                        label: t("Medium"),
                        value: "2",
                      },
                      // {
                      //   label: t("Hard"),
                      //   value: "3",
                      // },
                    ]
                  : [
                      {
                        label: t("Level"),
                        value: "-1",
                      },
                      {
                        label: t("Easy"),
                        value: "1",
                      },
                      {
                        label: t("Medium"),
                        value: "2",
                      },
                    ]
              }
              value={isNil(filter.levelId) ? null : toString(filter.levelId)}
              onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, levelId: +value }))}
            />
          </div>

          {/*<div>*/}
          {/*  <Select*/}
          {/*    data={[*/}
          {/*      {*/}
          {/*        label: t("Default"),*/}
          {/*        value: "0",*/}
          {/*      },*/}
          {/*      {*/}
          {/*        label: t("Suggestion"),*/}
          {/*        value: "1",*/}
          {/*      },*/}
          {/*      {*/}
          {/*        label: t("Similar"),*/}
          {/*        value: "2",*/}
          {/*      },*/}
          {/*    ]}*/}
          {/*    value={isNil(filter.suggestType) ? null : toString(filter.suggestType)}*/}
          {/*    onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, suggestType: +value }))}*/}
          {/*  />*/}
          {/*</div>*/}

          <div className="grid grid-cols-2 gap-4">
            {isManagerTask ? (
              <TextInput
                value={filter.ownerName}
                onChange={(e) => setFilter((prev) => ({ ...prev, pageIndex: 1, ownerName: e.target.value }))}
                placeholder={t("Owner...")}
              />
            ) : (
              <div />
            )}
            {isManagerTask && (
              <ExternalLink href="/cms/activity-code/12/create" className="w-full">
                <Button className="rounded-md w-full" leftIcon={<Plus width={20} />}>
                  {t("Create")}
                </Button>
              </ExternalLink>
            )}
          </div>
        </div>

        <div className="mt-4 grid lg:grid-cols-4 grid-cols-1 gap-4">
          {isLoading ? (
            <>
              {new Array(20).fill(null).map((item, index) => (
                <SkeletonTrainingItem key={index} />
              ))}
            </>
          ) : (
            <>
              {data?.activities?.results?.map((item) => (
                <TrainingItem handleHidden={handleHidden} key={item.id} data={item} />
              ))}
            </>
          )}
        </div>

        {data?.activities?.results && (
          <Group position="center" mt="xl">
            <Pagination
              pageIndex={filter.pageIndex}
              currentPageSize={data.activities.results.length}
              totalItems={data.activities.rowCount}
              totalPages={data.activities.pageCount}
              label={""}
              pageSize={20}
              onChange={(pageIndex) => setFilter((prev) => ({ ...prev, pageIndex }))}
            />
          </Group>
        )}

        {!data?.activities?.results?.length && !isLoading ? (
          <div className="flex flex-col items-center justify-center mb-10 py-10 bg-white text-center overflow-hidden">
            <NotFound height={199} width={350} />
            <Text mt="lg" size="lg" fw="bold">
              {t("No Data Found !")}
            </Text>
            <Text fw="bold">{t("Your search did not return any content.")}</Text>
          </div>
        ) : null}
      </Container>
    </div>
  );
};

export default TrainingIndex;
