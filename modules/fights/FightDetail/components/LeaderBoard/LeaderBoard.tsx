import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import {
  ActionIcon,
  Button,
  Group,
  Image,
  Avatar as MantineAvatar,
  Pagination,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import Avatar from "@src/components/Avatar";
import ExternalLink from "@src/components/ExternalLink";
import RawText from "@src/components/RawText/RawText";
import { ArrowExpand } from "@src/components/Svgr/components";
import { millisecondsToSecond, secondToHHMMSS } from "@src/helpers/date-time.helper";
import { convertDate, swap } from "@src/helpers/fuction-base.helpers";
import CodingService from "@src/services/Coding/CodingService";
import { ContestRegisterStatus } from "@src/services/Coding/types";
import { setShowHeader } from "@src/store/slices/applicationSlice";
import { selectProfile } from "@src/store/slices/authSlice";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import _, { isEmpty } from "lodash";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { Fragment, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { ChartBar, Check, Trash, X } from "tabler-icons-react";
import CharModal from "../CharModal";
import WinnerModal from "../WinnerModal";
import HeaderLeaderBoard from "./HeaderLeaderBoard";

interface LeaderBoardProps {
  contestId: any;
  contest: any;
  isTeam: boolean;
  activities: any[] | null | undefined;
  refetch: () => void;
  diffTime: number;
  onUpdateCountRegister: (count: number) => void;
  isApplyTotalTime: boolean;
}

export interface LeaderBoardRef {
  refetch: () => void;
}

const LeaderBoard = forwardRef<LeaderBoardRef, LeaderBoardProps>((props, ref) => {
  const {
    contestId,
    isTeam,
    onUpdateCountRegister,
    refetch: refetchContest,
    diffTime,
    contest,
    isApplyTotalTime,
  } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const profile = useSelector(selectProfile);

  const [filter, setFilter] = useState({ pageIndex: 1, pageSize: 10 });
  const [openWinnerModal, setOpenWinnerModal] = useState(false);
  const [dataWinner, setDataWinner] = useState(null);
  const [dataTop10, setDataTop10] = useState(null);
  const refOpenedWinner = useRef(null);

  const [isUpdateNote, setIsUpdateNote] = useState(false);

  const activities = props.activities?.filter((e) => !e.isDeleted);

  const isRegistered = !!contest && contest.registerId > 0;

  const isInListAssignReview =
    contest?.isAdmin || (!!contest && contest.listAssignReview?.some((e) => e.userId === profile?.userId));

  const { data, refetch } = useQuery({
    queryKey: [contestId, filter],
    queryFn: async () => {
      const res = await CodingService.contestGetLeaderBoard({
        ...filter,
        contestId,
      });
      const data = res.data?.data;

      onUpdateCountRegister(data?.metaData?.total || 0);

      data?.contestTeamWithScore?.forEach((team) => {
        team.totalExcuteTime = 0;
        team.listContestActivityScore?.forEach((score) => {
          score.excuteTimeSecond = millisecondsToSecond(score.excuteTime);
          team.totalExcuteTime += score.excuteTimeSecond;
          score.excuteTimeSecondStr = millisecondsToSecond(score.excuteTime).toFixed(2) + " s";
        });
        team.listContestActivityScoreDate?.forEach((score) => {
          score.excuteTimeSecond = millisecondsToSecond(score.excuteTime);
          team.totalExcuteTime += score.excuteTimeSecond;
          score.excuteTimeSecondStr = millisecondsToSecond(score.excuteTime).toFixed(2) + " s";
        });
        team.totalExcuteTimeStr = team.totalExcuteTime.toFixed(2) + " s";
      });

      return data;
    },
  });

  const fetchTop = async () => {
    const res = await CodingService.contestGetLeaderBoard({
      pageIndex: 1,
      pageSize: 10,
      contestId,
    });
    return res.data?.data;
  };

  useImperativeHandle(
    ref,
    () => ({
      refetch,
    }),
    [refetch]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (contest?.isTeam) return;

    const interval = setInterval(() => {
      const now = moment().subtract(diffTime);

      const isInMinutesEndContest =
        !!contest &&
        now.isSameOrAfter(convertDate(contest?.endTimeCode)) &&
        moment(convertDate(contest?.endTimeCode)).add(1, "minute").isAfter(now);

      if (isInMinutesEndContest && !refOpenedWinner.current) {
        refOpenedWinner.current = true;
        fetchTop()
          .then((data) => {
            if (data?.contestTeamWithScore) {
              setDataWinner(
                swap(
                  _.cloneDeep([...data.contestTeamWithScore, ...new Array(3).fill({})])
                    .splice(0, 3)
                    .map((team) => ({
                      ...team,
                      user: data.memberContests?.find((mem) => team?.teamId && mem.userId === team.teamId),
                    })),
                  0,
                  1
                )
              );
            }
          })
          .finally(() => {
            setOpenWinnerModal(true);
          });
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [contest?.endTimeCode]);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [openCharModal, setOpenCharModal] = useState(false);

  const groupedBySubName = _.groupBy(activities, "subName");
  const groupedBySubNameMapped = _.map(groupedBySubName, (group, key) => {
    return {
      subName: key,
      activities: group,
    };
  });

  const batches = groupedBySubNameMapped?.filter((e) => !isEmpty(e.subName) && e.subName !== "null");
  const activityNotInBatch = groupedBySubNameMapped?.flatMap((e) =>
    isEmpty(e.subName) || e.subName == "null" ? e.activities : []
  );

  const getRank = (index: number) => {
    if (index > 2) return index + 1;
    return <Image className="mx-auto" width={35} height={35} fit="cover" alt="" src={`/images/top${index}.svg`} />;
  };

  const handleApprove = async (userIdOrTeamId: number) => {
    confirmAction({
      message: t("Are you sure to approve this user or team?"),
      title: t("CONFIRMATION"),
      labelConfirm: t("Yes"),
      onConfirm: async () => {
        const res = await CodingService.contestRegisterApproveRegisted({ userIdOrTeamId, contestId });
        if (res.data?.success) {
          refetchContest();
          refetch();
          Notify.success(t("This team or this user has been approved successfully!"));
        } else if (res.data?.message) {
          Notify.error(t(res.data.message));
        }
      },
    });
  };

  const handleKickOut = async (userIdOrTeamId: number) => {
    confirmAction({
      message: t("Are you sure to deny this user or team?"),
      title: t("CONFIRMATION"),
      labelConfirm: t("Yes"),
      onConfirm: async () => {
        const res = await CodingService.contestRegisterKickoutRegisted({ userIdOrTeamId, contestId });
        if (res.data?.success) {
          refetchContest();
          refetch();
          Notify.success(
            contest?.isTeam
              ? t("This team has been denied from this batch!")
              : t("This user has been denied from this batch!")
          );
        } else if (res.data?.message) {
          Notify.error(t(res.data.message));
        }
      },
    });
  };

  const handleRemove = async (userIdOrTeamId: number) => {
    confirmAction({
      message: contest?.isTeam ? t("Are you sure to remove this team?") : t("Are you sure to remove this user?"),
      title: t("CONFIRMATION"),
      labelConfirm: t("Yes"),
      onConfirm: async () => {
        const res = await CodingService.contestRegisterKickoutRegisted({ userIdOrTeamId, contestId });
        if (res.data?.success) {
          refetchContest();
          refetch();
          Notify.success(
            contest?.isTeam
              ? t("This team has been denied from this batch!")
              : t("This user has been denied from this batch!")
          );
        } else if (res.data?.message) {
          Notify.error(t(res.data.message));
        }
      },
    });
  };

  const handleUpdateNote = async (note: string, userIdOrTeamId: number) => {
    setIsUpdateNote(false);
    const res = await CodingService.contestRegisterChangeDescription({
      description: note,
      contestId: contestId,
      userIdOrTeamId: userIdOrTeamId,
    });
    const message = res?.data?.message;
    if (res?.data?.success) {
      refetch();
      Notify.success(t("Description changed successfully!"));
    } else if (message) {
      Notify.error(t(message));
    }
  };

  return (
    <>
      {openWinnerModal && <WinnerModal data={dataWinner} onClose={() => setOpenWinnerModal(false)} />}

      {openCharModal && <CharModal activities={activities} data={dataTop10} onClose={() => setOpenCharModal(false)} />}

      <StyledLeaderBoard
        className={clsx("bg-white min-h-[300px] px-5 mb-20", {
          full: isFullScreen,
        })}
      >
        <div className="lg:m-0 mb-5 flex justify-between md:flex-row flex-col flex-wrap gap-x-5 gap-y-2 items-center">
          <Text component="h2" size="36px" lh="36px" color="indigo">
            {t("Leaderboard")}
          </Text>
          <Group className="gap-4 justify-center">
            <Button
              onClick={() => {
                fetchTop()
                  .then((data) => {
                    if (data?.contestTeamWithScore) {
                      setDataTop10(data?.contestTeamWithScore);
                    }
                  })
                  .finally(() => {
                    setOpenCharModal(true);
                  });
              }}
              color="blue"
              className="w-full md:w-auto"
              leftIcon={<ChartBar width={16} />}
            >
              {t("Top Submitted")}
            </Button>
            <Button
              onClick={() => {
                setIsFullScreen((prev) => {
                  if (prev) {
                    dispatch(setShowHeader(true));
                  } else {
                    dispatch(setShowHeader(false));
                  }
                  return !prev;
                });
              }}
              color="blue"
              className="w-full md:w-auto"
              leftIcon={<ArrowExpand width={16} />}
            >
              {isFullScreen ? t("Exit Full Screen") : t("Full Screen")}
            </Button>
          </Group>
        </div>

        {data && (
          <div>
            <div className="overflow-x-auto">
              <StyledTable captionSide="bottom" striped withBorder withColumnBorders>
                <HeaderLeaderBoard
                  isAdmin={contest?.isAdmin}
                  contestId={contest?.id}
                  isTeam={isTeam}
                  activities={activities}
                  isUpdateNote={isUpdateNote}
                  onSetIsUpdateNote={setIsUpdateNote}
                  isRegistered={isRegistered}
                  isRegisterViewActivity={contest?.isRegisterViewActivity}
                />

                <tbody>
                  {data?.contestTeamWithScore?.map((team, index) => {
                    const memberContests = isTeam && data?.memberContests?.filter((mem) => mem.teamId === team.teamId);
                    const user = !isTeam && data?.memberContests?.find((e) => e.userId === team.teamId);
                    const stt = (filter.pageIndex - 1) * filter.pageSize + index;
                    let totalSubmit = 0;
                    team.listContestActivityScore?.forEach((scoreDate) => {
                      totalSubmit += scoreDate?.totalSubmit || 0;
                    });

                    team.listContestActivityScoreDate?.forEach((scoreDate) => {
                      totalSubmit += scoreDate?.totalSubmit || 0;
                    });

                    let maxScoreSubmitIndex = 0;
                    team.listContestActivityScore?.forEach((scoreDate) => {
                      maxScoreSubmitIndex += scoreDate?.maxScoreSubmitIndex || 0;
                    });

                    team.listContestActivityScoreDate?.forEach((scoreDate) => {
                      maxScoreSubmitIndex += scoreDate?.maxScoreSubmitIndex || 0;
                    });

                    return (
                      <tr key={team.teamId}>
                        <td>{getRank(stt)}</td>
                        {isTeam && (
                          <td>
                            <Tooltip
                              width={260}
                              classNames={{ tooltip: "border shadow-sm" }}
                              label={
                                <div className="flex flex-col w-full items-start px-3">
                                  <div className="py-2">
                                    <Text c="dark" fw="bold" size="lg">
                                      <TextLineCamp className="max-w-[280px]">{team.teamName}</TextLineCamp>
                                    </Text>
                                  </div>
                                  {memberContests?.map((user: any) => (
                                    <div
                                      key={`${user.userId}-${team.teamId}`}
                                      className="w-full grid gap-2 grid-cols-[44px_auto] pt-2 pb-4 border-t"
                                    >
                                      <Avatar
                                        src={user.userAvatarUrl}
                                        userId={user.userId}
                                        userExpLevel={user?.userExpLevel}
                                        size="sm"
                                      />
                                      <div className="flex flex-col gap-1 items-start">
                                        <Text fw="bold" c="dark">
                                          {user.userName}
                                        </Text>
                                        <Text c="gray" size="11px">
                                          EXP: {user.userExpLevel?.currentUserExperiencePoint}
                                        </Text>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              }
                              color="white"
                              withArrow
                              arrowSize={8}
                              position="top-start"
                            >
                              <div className="flex gap-2">
                                <MantineAvatar.Group spacing="sm">
                                  {memberContests?.map((e) => (
                                    <MantineAvatar key={e.userId} size="32px" src={e.userAvatarUrl} radius="xl" />
                                  ))}
                                </MantineAvatar.Group>
                                <div className="flex flex-col items-start">
                                  <Text fw="bold" size="11px">
                                    {team.teamName}
                                  </Text>
                                  {isUpdateNote ? (
                                    <TextInput
                                      size="11px"
                                      defaultValue={team.otherDescription}
                                      onBlur={(e) => {
                                        handleUpdateNote(e.target.value, team.teamId);
                                      }}
                                    />
                                  ) : (
                                    <Text size="11px" c="gray">
                                      {_.isNil(team.otherDescription) ? "-" : team.otherDescription}
                                    </Text>
                                  )}
                                </div>
                              </div>
                            </Tooltip>
                          </td>
                        )}

                        {!isTeam && (
                          <td>
                            <div className="flex gap-4 items-center py-1">
                              <Tooltip
                                width={260}
                                classNames={{ tooltip: "border shadow-sm" }}
                                label={
                                  <div className="flex flex-col w-full items-start px-3">
                                    <div
                                      key={`${user?.userId}-${team.teamId}`}
                                      className="w-full grid gap-2 grid-cols-[44px_auto] pt-2 pb-4"
                                    >
                                      <Avatar
                                        src={user?.userAvatarUrl}
                                        userExpLevel={user?.userExpLevel}
                                        userId={user?.userId}
                                        size="sm"
                                      />
                                      <div className=" flex flex-col gap-1 items-start">
                                        <Text fw="bold" c="dark">
                                          {user?.userName}
                                        </Text>
                                        <Text c="gray" size="11px">
                                          EXP: {user?.userExpLevel?.currentUserExperiencePoint}
                                        </Text>
                                      </div>
                                    </div>
                                  </div>
                                }
                                color="white"
                                withArrow
                                arrowSize={8}
                                position="bottom"
                              >
                                <Avatar
                                  userId={team.teamId}
                                  src={user?.userAvatarUrl}
                                  userExpLevel={user?.userExpLevel}
                                  size="sm"
                                />
                              </Tooltip>
                              <div className="max-w-[280px] overflow-hidden text-xs text-[#898989] flex flex-col items-start">
                                <ExternalLink
                                  className="text-primary text-sm font-semibold"
                                  href={`/profile/${team.teamId}`}
                                >
                                  <TextLineCamp>{team.teamName}</TextLineCamp>
                                </ExternalLink>
                                {!isEmpty(team.location) && (
                                  <div className="text-left">
                                    <RawText>{team.location}</RawText>
                                  </div>
                                )}
                                {isUpdateNote && (
                                  <TextInput
                                    size="11px"
                                    defaultValue={team.otherDescription}
                                    onBlur={(e) => {
                                      handleUpdateNote(e.target.value, team.teamId);
                                    }}
                                  />
                                )}{" "}
                                {!isUpdateNote && !isEmpty(team.otherDescription) && (
                                  <TextLineCamp>{team.otherDescription}</TextLineCamp>
                                )}
                              </div>
                            </div>
                          </td>
                        )}

                        {activityNotInBatch?.map((activity: any) => {
                          let activityWithScore = team.listContestActivityScore?.find(
                            (activityWS) => activityWS.activityId === activity.activityId
                          );
                          if (!activityWithScore) {
                            activityWithScore = team.listContestActivityScoreDate?.find(
                              (activityWS) => activityWS.activityId === activity.activityId
                            );
                          }

                          return (
                            <td key={activity.activityId} className="align-top">
                              {activityWithScore?.totalSubmit > 0 ? (
                                <>
                                  <Text size="md" fw="bold" pb="4px">
                                    {activityWithScore.score}
                                  </Text>
                                  <Text c="gray">
                                    <Text size="13px">{secondToHHMMSS(activityWithScore.timeComplete)}</Text>
                                    <Text size="13px">{activityWithScore.excuteTimeSecondStr}</Text>
                                    <Text size="11px" c="#b9b5af">
                                      {activityWithScore.maxScoreSubmitIndex}{" "}
                                      {activityWithScore.maxScoreSubmitIndex > 1 ? t("tries") : t("try")}
                                    </Text>
                                    <Text size="11px" c="#b9b5af">
                                      {activityWithScore.numberCanSubmit > 0
                                        ? `${activityWithScore.totalSubmit}/${activityWithScore.numberCanSubmit} ${t(
                                            "submission"
                                          )}`
                                        : null}
                                    </Text>
                                  </Text>
                                </>
                              ) : (
                                "-"
                              )}
                            </td>
                          );
                        })}

                        {batches?.map((batch) => (
                          <Fragment key={batch.subName}>
                            {batch.activities?.map((activity: any, index) => {
                              let activityWithScore = team.listContestActivityScore?.find(
                                (activityWS) => activityWS.activityId === activity.activityId
                              );
                              if (!activityWithScore) {
                                activityWithScore = team.listContestActivityScoreDate?.find(
                                  (activityWS) => activityWS.activityId === activity.activityId
                                );
                              }

                              let totalElement = null;

                              if (batch.activities.length === index + 1 && batch.activities.length > 1) {
                                let listScore: any[] =
                                  team.listContestActivityScore?.filter((activityWS) =>
                                    batch.activities.some((activity) => activity.activityId === activityWS.activityId)
                                  ) || [];

                                listScore.push(
                                  ...(team.listContestActivityScoreDate?.filter((activityWS) =>
                                    batch.activities.some((activity) => activity.activityId === activityWS.activityId)
                                  ) || [])
                                );

                                listScore = listScore.filter((e) => e.totalSubmit > 0);

                                let totalExecuteTime = listScore.reduce((prev, e) => prev + e.excuteTimeSecond, 0);
                                const maxScoreSubmitIndex = listScore.reduce(
                                  (prev, a) => prev + a.maxScoreSubmitIndex,
                                  0
                                );
                                const totalScore = listScore.reduce((prev, a) => prev + a.score, 0);

                                let totalTimeComplete = listScore.reduce((prev, e) => prev + e.timeComplete, 0);
                                if (!isTeam || !isApplyTotalTime) {
                                  totalTimeComplete = _.maxBy(listScore, (e) => e.timeComplete)?.timeComplete;
                                }

                                if (listScore && listScore.length > 0) {
                                  totalElement = (
                                    <td className="align-top">
                                      <Text c="red" size="md" fw="bold" pb="4px">
                                        {totalScore}
                                      </Text>
                                      <Text c="gray">
                                        <Text size="13px">{secondToHHMMSS(totalTimeComplete)}</Text>
                                        <Text size="13px">{totalExecuteTime.toFixed(2)} s</Text>
                                        <Text size="11px" c="#b9b5af">
                                          {maxScoreSubmitIndex} {maxScoreSubmitIndex > 1 ? t("tries") : t("try")}
                                        </Text>
                                      </Text>
                                    </td>
                                  );
                                } else {
                                  totalElement = <td className="align-top">-</td>;
                                }
                              }

                              return (
                                <Fragment key={activity.activityId}>
                                  <td className="align-top">
                                    {activityWithScore?.totalSubmit > 0 ? (
                                      <>
                                        <Text size="md" fw="bold" pb="4px">
                                          {activityWithScore.score}
                                        </Text>
                                        <Text c="gray">
                                          <Text size="13px">{secondToHHMMSS(activityWithScore.timeComplete)}</Text>
                                          <Text size="13px">{activityWithScore.excuteTimeSecondStr}</Text>
                                          <Text size="11px" c="#b9b5af">
                                            {activityWithScore.maxScoreSubmitIndex}{" "}
                                            {activityWithScore.maxScoreSubmitIndex > 1 ? t("tries") : t("try")}
                                          </Text>
                                          <Text size="11px" c="#b9b5af">
                                            {activityWithScore.numberCanSubmit > 0
                                              ? `${activityWithScore.totalSubmit}/${
                                                  activityWithScore.numberCanSubmit
                                                } ${t("submission")}`
                                              : null}
                                          </Text>
                                        </Text>
                                      </>
                                    ) : (
                                      "-"
                                    )}
                                  </td>
                                  {totalElement}
                                </Fragment>
                              );
                            })}
                          </Fragment>
                        ))}

                        <td className="align-top">
                          {totalSubmit > 0 ? (
                            <>
                              <Text c="red" size="md" pb="4px" fw="bold">
                                {team?.scoreContest}
                              </Text>
                              <Text c="gray">
                                <Text size="13px">{secondToHHMMSS(team?.timeSubmitted)}</Text>
                                <Text size="13px">{team?.totalExcuteTimeStr}</Text>
                                <Text size="11px" c="#b9b5af">
                                  {maxScoreSubmitIndex} {maxScoreSubmitIndex > 1 ? t("tries") : t("try")}
                                </Text>
                              </Text>
                            </>
                          ) : (
                            "-"
                          )}
                        </td>

                        {!!contest?.isAdmin && (
                          <td>
                            <Group position="center" spacing={6}>
                              {contest?.isRequireApproval &&
                              isInListAssignReview &&
                              team?.registerStatus === ContestRegisterStatus.Waiting ? (
                                <>
                                  <ActionIcon
                                    onClick={() => handleApprove(team.teamId)}
                                    size="11px"
                                    radius="xl"
                                    color="green"
                                    variant="filled"
                                  >
                                    <Check width={14} />
                                  </ActionIcon>
                                  <ActionIcon
                                    onClick={() => handleKickOut(team.teamId)}
                                    size="11px"
                                    color="red"
                                    radius="xl"
                                    variant="outline"
                                  >
                                    <X width={14} />
                                  </ActionIcon>
                                </>
                              ) : null}
                              {(contest && !contest?.isRequireApproval) ||
                              (isInListAssignReview && team?.registerStatus === ContestRegisterStatus.Approved) ? (
                                <ActionIcon onClick={() => handleRemove(team.teamId)} color="red">
                                  <Trash width={16} />
                                </ActionIcon>
                              ) : null}
                            </Group>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </StyledTable>
            </div>
            <Group position="center" className="py-10 mb-16">
              <Pagination
                withEdges
                value={filter.pageIndex}
                onChange={(pageIndex) => setFilter((prev) => ({ ...prev, pageIndex }))}
                color="blue"
                total={data.metaData?.pageTotal}
              />
            </Group>
          </div>
        )}
      </StyledLeaderBoard>
    </>
  );
});

LeaderBoard.displayName = "LeaderBoard";

export default LeaderBoard;

const StyledLeaderBoard = styled.div`
  &.full {
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    overflow-y: auto;
  }
`;

const StyledTable = styled(Table)`
  thead > tr > th,
  tbody > tr > td {
    border: 2px solid #f1f1f1;
    text-align: center;
    font-size: 13px;
    color: #333;
  }

  thead > tr > th {
    background: #d1e3fc;
    text-transform: uppercase;
  }

  .highlight {
    background: #b3cbd7;
    color: #fff;
  }
`;
