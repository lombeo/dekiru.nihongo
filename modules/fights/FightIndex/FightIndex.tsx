import { Breadcrumbs } from "@edn/components";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import {
  Button,
  Flex,
  Group,
  Image,
  Avatar as MantineAvatar,
  Pagination,
  Skeleton,
  Tabs,
  Text,
  TextInput,
  Tooltip,
  clsx,
} from "@mantine/core";
import { Container } from "@src/components";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import PinBadge from "@src/components/PinBadge";
import { NotFound, UsersGroup } from "@src/components/Svgr/components";
import { CDN_URL } from "@src/config";
import { convertDate, FunctionBase } from "@src/helpers/fuction-base.helpers";
import useDebounce from "@src/hooks/useDebounce";
import { useRouter } from "@src/hooks/useRouter";
import CountDownContestSmall from "@src/modules/fights/FightIndex/components/CountDownContestSmall";
import CodingService from "@src/services/Coding/CodingService";
import { ContestType } from "@src/services/Coding/types";
import { isEmpty } from "lodash";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Plus, User } from "tabler-icons-react";
import BoxPoster from "../FightDetail/components/BoxPoster";
import _ from "lodash";

const FightIndex = () => {
  const { t } = useTranslation();
  const [tabActive, setTabActive] = useState("public");
  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
    contestType: tabActive === "public" ? ContestType.Public : ContestType.Private,
  });
  const emptyItems = useMemo(() => new Array(10).fill(null), []);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const filterDebounce = useDebounce(filter);
  const router = useRouter();
  const [hotContest, setHotContest] = useState(null);
  const [diffTime, setDiffTime] = useState(0);
  const [listContest, setListContest] = useState([]);

  const handleChangeTab = (tab: string) => {
    setDiffTime(0);
    setTabActive(tab);
    setFilter((prev) => ({
      ...prev,
      contestType: tab === "public" ? ContestType.Public : ContestType.Private,
      shareKey: "",
      keyword: "",
      pageIndex: 1,
    }));
  };

  const fetch = async () => {
    const res = await CodingService.contestList({
      ...filter,
      contestType: isEmpty(filter.shareKey) ? filter.contestType : ContestType.Share,
    });
    if (res?.data?.success) {
      const data = res.data;
      setData(data);
      setHotContest(data?.data?.hotContest);

      if (!data?.data?.listContest?.length && !_.isEmpty(data?.data?.hotContest)) {
        setListContest([{ ...data?.data?.hotContest }]);
      } else {
        setListContest(data?.data?.listContest || []);
      }

      if (data?.data?.utcNow) {
        const diffTime = moment().diff(convertDate(data.data.utcNow));
        setDiffTime(diffTime);
      }
    } else {
      setData(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [filterDebounce]);

  const getRank = (index: number) => {
    return <Image width={24} height={24} fit="cover" alt="" src={`/images/top${index}.svg`} />;
  };

  const handleRegisterSuccess = () => {
    router.push(`/fights/detail/${hotContest?.id}`);
  };

  return (
    <div className="pb-20">
      <Container>
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                title: t("Fights"),
              },
            ]}
          />
        </Flex>
        <BoxPoster
          diffTime={diffTime}
          data={hotContest}
          countRegister={hotContest?.countRegister}
          onRegisterSuccess={handleRegisterSuccess}
          context="list"
        />
        <div className="mt-4 bg-white">
          <div className="flex justify-between gap-5 items-center shadow-[0_-0.125rem_#dee2e6_inset] pr-4">
            <Tabs
              classNames={{
                tabLabel: "uppercase text-[15px] ",
                tab: "py-4 aria-selected:text-primary aria-selected:font-semibold",
              }}
              value={tabActive}
              onTabChange={handleChangeTab}
            >
              <Tabs.List>
                <Tabs.Tab value="public">{t("Public")}</Tabs.Tab>
                <Tabs.Tab value="private">{t("fight.Private")}</Tabs.Tab>
              </Tabs.List>
            </Tabs>
            <Group>
              {data?.data?.isAdmin && (
                <Button color="orange" leftIcon={<Plus width={18} />} onClick={() => router.push("/fights/create")}>
                  {t("Create")}
                </Button>
              )}
            </Group>
          </div>
          <div className="p-4 flex gap-2 items-center max-w-[420px]">
            <TextInput
              value={filter.keyword}
              onChange={(e) => setFilter((prev) => ({ ...prev, pageIndex: 1, keyword: e.target.value }))}
              className="w-full"
              placeholder={t("Contest name")}
            />
            {tabActive === "private" && (
              <TextInput
                value={filter.shareKey}
                onChange={(e) => setFilter((prev) => ({ ...prev, pageIndex: 1, shareKey: e.target.value }))}
                className="w-full"
                placeholder={t("Share code")}
              />
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3 mt-3">
            {emptyItems?.map((e, index) => (
              <Skeleton key={index} height={241} radius={0} />
            ))}
          </div>
        ) : (
          <>
            {listContest.length > 0 ? (
              <div>
                <div className="mt-3 flex gap-3 flex-col mb-4">
                  {listContest.map((contest, index) => {
                    const teamTopScore = contest.teamTopScore?.map((team) => {
                      if (contest.isTeam) {
                        const listMember = team.listMember?.map((member) => ({
                          ...member,
                          ...data.data.memberContests?.find((x) => x.userId === member.userId),
                        }));
                        return {
                          ...team,
                          listMember,
                        };
                      }
                      const user = data.data.memberContests?.find((x) => x.userId === team.id);
                      return {
                        ...team,
                        user,
                      };
                    });

                    let href = null;
                    if (contest?.isNewQuizContest) {
                      const eventName = FunctionBase.slugify(hotContest?.title);
                      const contestName = FunctionBase.slugify(contest?.title);
                      href = `/event/${eventName}/${contestName}/${contest?.id}`;
                    } else {
                      href = isEmpty(filter.shareKey)
                        ? `/fights/detail/${contest.id}`
                        : `/fights/detail/${contest.id}?shareKey=${filter.shareKey}`;

                      if (
                        contest.shareKey &&
                        (filter.contestType === ContestType.Private || filter.contestType === ContestType.Share)
                      ) {
                        href = `/fights/detail/${contest.id}?shareKey=${contest.shareKey}`;
                      }
                    }

                    return (
                      <Link
                        key={contest.id}
                        href={href}
                        onClick={(e) => {
                          e.preventDefault();
                          if (e.target.closest(".share-btn")) {
                            return;
                          } else {
                            router.push(href);
                          }
                          router.push(href);
                        }}
                        className="hover:opacity-100 rounded-md shadow-md relative"
                      >
                        {contest.isEvent && (
                          <PinBadge isPopular className="md:right-[65px] z-[10] right-[24px] left-auto">
                            {t("Event")}
                          </PinBadge>
                        )}
                        <div
                          className={clsx(
                            "rounded-md overflow-hidden cursor-pointer grid lg:grid-cols-[auto_100px_220px] gap-y-2 relative"
                          )}
                        >
                          <div
                            className={clsx("grid lg:grid-cols-[140px_auto] gap-5 py-5 lg:px-0 px-5", {
                              "bg-white": index % 2 == 0,
                              "bg-[#F3F9FF]": index % 2 != 0,
                            })}
                          >
                            <div className="flex justify-center items-center">
                              <Image
                                height={80}
                                width={80}
                                fit="contain"
                                alt=""
                                src={
                                  contest && isEmpty(contest.icon)
                                    ? "/default-image.png"
                                    : contest?.icon?.startsWith("http")
                                    ? contest?.icon
                                    : CDN_URL + contest?.icon
                                }
                              />
                            </div>
                            <div>
                              <TextLineCamp>
                                <h1 className="m-0 text-[22px] font-semibold">{contest.title}</h1>
                              </TextLineCamp>
                              <div className="text-sm">
                                <TextLineCamp>{contest.description}</TextLineCamp>
                              </div>
                              <div className="flex flex-wrap gap-x-6 gap-y-8 mt-4 mb-8">
                                {contest.isTeam &&
                                  teamTopScore?.map((team, indexTeam: number) => (
                                    <Tooltip
                                      key={team.id}
                                      width={260}
                                      classNames={{ tooltip: "border shadow-sm" }}
                                      label={
                                        <div className="flex flex-col w-full items-start px-3">
                                          <div className="py-2">
                                            <Text c="dark" fw="bold" size="lg">
                                              {team.name}
                                            </Text>
                                          </div>
                                          {team.listMember?.map((member: any) => (
                                            <div
                                              key={member.userId}
                                              className="w-full grid gap-2 grid-cols-[44px_auto] pt-2 pb-4 border-t"
                                            >
                                              <Avatar
                                                userExpLevel={member.userExpLevel}
                                                userId={member.userId}
                                                src={member.userAvatarUrl}
                                                size="sm"
                                              />
                                              <div className="flex flex-col gap-1 items-start">
                                                <TextLineCamp>
                                                  <Text fw="bold" c="dark">
                                                    {member.userName}
                                                  </Text>
                                                </TextLineCamp>
                                                <Text c="gray" size="xs">
                                                  EXP: {member.userExpLevel?.currentUserExperiencePoint}
                                                </Text>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      }
                                      color="white"
                                      withArrow
                                      arrowSize={8}
                                    >
                                      <div className="flex gap-2">
                                        <MantineAvatar.Group spacing="sm">
                                          {team.listMember?.map((e) => (
                                            <MantineAvatar
                                              key={e.userId}
                                              size="32px"
                                              src={e.userAvatarUrl}
                                              radius="xl"
                                            />
                                          ))}
                                        </MantineAvatar.Group>
                                        <div className="flex flex-col items-start">
                                          <TextLineCamp className="max-w-[120px] min-w-[80px]">
                                            <Text fw="bold" c="dark">
                                              {team.name}
                                            </Text>
                                          </TextLineCamp>
                                          <div className="mt-1">{getRank(indexTeam)}</div>
                                        </div>
                                      </div>
                                    </Tooltip>
                                  ))}
                                {!contest.isTeam &&
                                  teamTopScore?.map((item: any, index) => {
                                    if (!item.user) return null;
                                    return (
                                      <div key={item.user.userId} className="grid gap-2 grid-cols-[48px_auto]">
                                        <Avatar
                                          userExpLevel={item.user?.userExpLevel}
                                          src={item.user.userAvatarUrl}
                                          userId={item.user.userId}
                                          size="md"
                                        />
                                        <div>
                                          <TextLineCamp className="text-sm max-w-[120px] min-w-[80px]">
                                            {item.user.userName}
                                          </TextLineCamp>
                                          <Image
                                            width={24}
                                            height={24}
                                            fit="cover"
                                            alt=""
                                            src={`/images/top${index}.svg`}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                              <div className="flex flex-wrap gap-2 mt-4 mb-2">
                                {contest.tags
                                  ?.split(",")
                                  ?.filter((e) => !isEmpty(e))
                                  ?.map((tag) => (
                                    <div
                                      key={tag}
                                      className="text-xs border border-[#CFCECE] rounded-md text-[#8D8D85] bg-[#EBEBEB] px-2 py-1"
                                    >
                                      {tag}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                          <div
                            className={clsx("flex gap-1 text-[#898989] items-center justify-center capitalize py-5", {
                              "bg-white": index % 2 == 0,
                              "bg-[#F3F9FF]": index % 2 != 0,
                            })}
                          >
                            {contest.isTeam ? <UsersGroup width={20} height={20} /> : <User width={20} height={20} />}
                            {contest.countRegister > 0 ? (
                              <div>
                                <strong className="text-base font-[900] text-[#FF5C00]">{contest.countRegister}</strong>
                                &nbsp;
                              </div>
                            ) : (
                              "--"
                            )}
                          </div>
                          <CountDownContestSmall
                            className={clsx("p-5", {
                              "bg-white": index % 2 == 0,
                              "bg-[#F3F9FF]": index % 2 != 0,
                            })}
                            diffTime={diffTime}
                            data={contest}
                          />
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <Group position="center" className="mt-4">
                  <Pagination
                    withEdges
                    value={filter.pageIndex}
                    onChange={(pageIndex) => setFilter((prev) => ({ ...prev, pageIndex }))}
                    total={data?.metaData?.pageTotal}
                  />
                </Group>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center mb-10 bg-white py-10 text-center">
                <NotFound height={199} width={350} />
                <Text mt="lg" size="lg" fw="bold">
                  {t("No Data Found !")}
                </Text>
                <Text fw="bold">{t("Your search did not return any content.")}</Text>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default FightIndex;

const BadgeEvent = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  top: 0;
  right: 0;
  overflow: hidden;

  &::before {
    top: 0;
    left: 6px;
    transform: rotate(35deg);
  }
  &::before,
  &::after {
    position: absolute;
    z-index: -1;
    content: "";
    display: block;
    border: 10px solid #008000;
    border-top-color: transparent;
    border-right-color: transparent;
  }
  > div {
    position: absolute;
    display: block;
    width: 150px;
    padding: 2px 0;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    color: #fff;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    top: 25px;
    right: -35px;
    transform: rotate(45deg);
    background: #008000;
  }
`;
