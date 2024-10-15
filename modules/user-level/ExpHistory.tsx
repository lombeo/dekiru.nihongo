import { Breadcrumbs, Text } from "@edn/components";
import { Pagination, Select, Table } from "@mantine/core";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import { ExperiencePointGainingSource } from "@src/constants/exp.constant";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { useRouter } from "@src/hooks/useRouter";
import { IdentityService } from "@src/services/IdentityService";
import styles from "@src/styles/Table.module.scss";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Trans, useTranslation } from "next-i18next";
import { useState } from "react";

const ExpHistory = (props: any) => {
  const { isCP } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;

  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 20,
    expSource: "0",
  });

  const gainingSources = useQuery({
    queryKey: ["userGetGainingSources", isCP],
    queryFn: async () => {
      try {
        const res = await IdentityService.userGetGainingSources({
          isContributor: isCP,
        });
        return res?.data?.data?.map((e) => ({ label: e.text, value: e.value }));
      } catch (e) {}
      return null;
    },
  });

  const { data, refetch, status } = useQuery({
    queryKey: ["userLoadHistory", isCP, id, filter],
    queryFn: async () => {
      try {
        if (isCP) {
          const res = await IdentityService.userLoadCpHistory({
            ...filter,
            userId: id,
            expSource: +filter.expSource,
          });
          return res.data;
        } else {
          const res = await IdentityService.loadExpHistory({
            ...filter,
            userId: id,
            expSource: +filter.expSource,
          });
          return res.data;
        }
      } catch (e) {}
      return null;
    },
  });

  const getContent = (historyItem: any) => {
    let userId = 0;
    let userName = "";

    let relatedLink = (
      <Link className="text-blue-primary" href={historyItem.relatedContentUrl}>
        {historyItem.relatedContentName}
      </Link>
    );

    let userLink = <span></span>;

    try {
      if (historyItem.relatedDataJson) {
        historyItem.relatedData = JSON.parse(historyItem.relatedDataJson);
      }
    } catch (e) {}

    if (historyItem.relatedData != null) {
      if (historyItem.source == ExperiencePointGainingSource.HAD_COURSE_COMPLETED) {
        userId = historyItem.relatedData.LearnerId;
        userName = historyItem.relatedData.LearnerName;
      } else if (historyItem.source == ExperiencePointGainingSource.HAD_TASK_SUBMITTED) {
        userId = historyItem.relatedData.SubmitterId;
        userName = historyItem.relatedData.SubmitterName;
      } else if (historyItem.source == ExperiencePointGainingSource.HAD_TASK_REJECTED) {
        userId = historyItem.relatedData.RejectorId;
        userName = historyItem.relatedData.RejectorName;
      } else if (historyItem.source == ExperiencePointGainingSource.HAD_TASK_REJECTED) {
        userId = historyItem.relatedData.RejectorId;
        userName = historyItem.relatedData.RejectorName;
      } else if (
        historyItem.source == ExperiencePointGainingSource.HAD_BLOG_RATED_UP ||
        historyItem.source == ExperiencePointGainingSource.HAD_BLOG_RATED_DOWN
      ) {
        userId = historyItem.relatedData.UserId;
        userName = historyItem.relatedData.RatedByName;
      } else if (
        historyItem.source == ExperiencePointGainingSource.HAD_FORUM_TOPIC_VOTED_UP ||
        historyItem.source == ExperiencePointGainingSource.HAD_FORUM_TOPIC_VOTED_DOWN ||
        historyItem.source == ExperiencePointGainingSource.HAD_FORUM_TOPIC_UNDONE_UP ||
        historyItem.source == ExperiencePointGainingSource.HAD_FORUM_TOPIC_UNDONE_DOWN
      ) {
        userId = historyItem.relatedData.UserId;
        userName = historyItem.relatedData.VotedByName;
      } else if (historyItem.source == ExperiencePointGainingSource.HAD_CHALLENGE_COMPLETED) {
        userId = historyItem.relatedData.UserId;
        userName = historyItem.relatedData.SubmitterName;
      }
      if (userId != 0) {
        userLink = (
          <Link className="text-blue-primary" href={`/profile/${userId}`}>
            {userName}
          </Link>
        );
      }
    }

    const courseLink = (
      <Link className="text-blue-primary" href={historyItem.relatedData?.CourseUrl}>
        {historyItem.relatedData?.CourseName}
      </Link>
    );
    const contestLink = (
      <Link className="text-blue-primary" href={historyItem.relatedData?.ContestUrl}>
        {historyItem.relatedData?.ContestName}
      </Link>
    );
    const challengeLink = (
      <Link className="text-blue-primary" href={historyItem.relatedData?.ChallengeUrl}>
        {historyItem.relatedData?.ChallengeName}
      </Link>
    );

    let message: any = "";
    switch (historyItem.source) {
      case 0:
        message = "USER_XP_HISTORY_FILTER_ALL";
        break;
      case 1:
        message = "USER_XP_HISTORY_COMPLETED_COURSE";
        break;
      case 2:
        message = "USER_XP_HISTORY_COMPLETED_TASK";
        break;
      case 3:
        message = "USER_XP_HISTORY_FINISHED_CONTEST";
        break;
      case 4:
        message = "USER_XP_HISTORY_HAD_DISCUSSION_RATED_UP";
        break;
      case 5:
        message = "USER_XP_HISTORY_HAD_DISCUSSION_RATED_DOWN";
        break;
      case 6:
        message = "USER_XP_HISTORY_HAD_DISCUSSION_RATED_UNDONEUP";
        break;
      case 7:
        message = "USER_XP_HISTORY_HAD_DISCUSSION_RATED_UNDONEDOWN";
        break;
      case 8:
        message = "USER_XP_HISTORY_HAD_COURSE_COMPLETED";
        break;
      case 9:
        message = "USER_XP_HISTORY_HAD_TASK_COMPLETED";
        break;
      case 10:
        message = "USER_XP_HISTORY_CREATED_COURSE";
        break;
      case 11:
        message = "USER_XP_HISTORY_CREATED_TASK";
        break;
      case 12:
        message = "USER_XP_HISTORY_CREATED_TASK";
        break;
      case 13:
        message = "USER_XP_HISTORY_HAD_TOPIC_VOTED";
        break;
      case 14:
        message = "USER_XP_HISTORY_HAD_TASK_REJECTED";
        break;
      case 15:
        message = "USER_XP_HISTORY_HAD_TASK_REJECTED";
        break;
      case 16:
        message = "USER_XP_HISTORY_COMPLETED_COURSE_TASK";
        break;
      case 17:
        message = "USER_XP_HISTORY_CREATED_FORUM_TOPIC";
        break;
      case 18:
        message = "USER_XP_HISTORY_CREATED_CONTEST";
        break;
      case 19:
        message = "USER_XP_HISTORY_COMPLETED_CONTEST_TASK";
        break;
      case 20:
        message = "USER_XP_HISTORY_CREATED_CHALLENGE";
        break;
      case 21:
        message = "USER_XP_HISTORY_HAD_BLOG_PUBLISHED";
        break;
      case 22:
        message = "USER_XP_HISTORY_HAD_BLOG_UN_PUBLISHED";
        break;
      case 23:
        message = "USER_XP_HISTORY_HAD_BLOG_VIEWED";
        break;
      case 24:
        message = "USER_XP_HISTORY_HAD_TASK_ADDED_TO_COURSE";
        break;
      case 25:
        message = "USER_XP_HISTORY_HAD_TASK_ADDED_TO_CONTEST";
        break;
      case 26:
        message = "USER_XP_HISTORY_HAD_CONTEST_COMPLETED";
        break;
      case 27:
        message = "USER_XP_HISTORY_HAD_TASK_ADDED_TO_CHALLENGE";
        break;
      case 28:
        message = "USER_XP_HISTORY_HAD_CHALLENGE_COMPLETED";
        break;
      case 29:
        message = "USER_XP_HISTORY_HAD_BLOG_RATED_UP";
        break;
      case 30:
        message = "USER_XP_HISTORY_HAD_BLOG_RATED_DOWN";
        break;
      default:
        message = "";
        break;
    }

    return (
      <Trans
        i18nKey={message}
        t={t}
        components={{ relatedLink, contestLink, userLink, courseLink, challengeLink }}
        values={{
          relatedContentName: historyItem.relatedContentName,
          contestName: historyItem?.relatedData?.ContestName,
          countRegister: historyItem?.relatedData?.CountRegister,
          userName: userName,
          courseName: historyItem?.relatedData?.CourseName,
          challengeName: historyItem?.relatedData?.ChallengeName,
        }}
      />
    );
  };

  return (
    <div className="pb-20">
      <Container>
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              href: `/profile/${id}`,
              title: t("Profile"),
            },
            {
              title: t(isCP ? "Contributor experience history" : "User experience history"),
            },
          ]}
        />
        <div className="flex flex-col gap-4 bg-white p-5">
          <div className="text-[24px] font-semibold">
            {t(isCP ? "Contributor experience history" : "User experience history")}
          </div>
          <Link href={isCP ? `/userlevel/exphistory/${id}` : `/userlevel/cphistory/${id}`} className="text-[#337ab7]">
            {t(isCP ? "User experience history" : "Contributor experience history")}
          </Link>
          <div className="grid gap-x-4 gap-y-2 grid-cols-1 md:grid-cols-[200px_auto] items-center">
            <div className="text-[#555] font-semibold">{t("Username")}</div>
            <div>{data?.data?.userName}</div>
            <div className="text-[#555] font-semibold">{t("EXP Gained")}</div>
            <div>
              <Select
                data={gainingSources.data?.map((e) => ({ ...e, label: t(e.label) })) || []}
                value={filter.expSource}
                key={isCP ? "cp" : "lp"}
                className="max-w-[350px]"
                onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, expSource: value }))}
              />
            </div>
            <div className="text-[#555] font-semibold">
              {t("EXP")}: <span className="font-normal">{data?.data?.totalExp}</span>
            </div>
          </div>
          <div className="mb-10">
            <div className="overflow-auto">
              <Table className={styles.table} captionSide="bottom" striped withBorder>
                <thead>
                  <tr>
                    <th>{t("Exp")}</th>
                    <th>{t("Detail")}</th>
                    <th>{t("Time")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.items?.map((e: any, index) => {
                    return (
                      <tr key={e.id}>
                        <td
                          className={clsx({
                            "text-[#008000]": e.experiencePoint > 0,
                            "text-[#f00]": e.experiencePoint < 0,
                          })}
                        >
                          {e.experiencePoint >= 0 ? "+" : null}
                          {e.experiencePoint}
                        </td>
                        <td>{getContent(e)}</td>
                        <td>{formatDateGMT(e.gainedTime, "HH:mm:ss DD/MM/YYYY")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
            {!!data?.data?.items?.length && (
              <div className="mt-8 pb-8 flex justify-center">
                <Pagination
                  color="blue"
                  withEdges
                  value={filter.pageIndex}
                  total={data.metaData?.pageTotal}
                  onChange={(page) => {
                    setFilter((prev) => ({
                      ...prev,
                      pageIndex: page,
                    }));
                  }}
                />
              </div>
            )}
            {status === "success" && !data?.data?.items?.length && (
              <Text className="p-12 bg-white text-center text-gray-secondary">{t("No results found")}</Text>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ExpHistory;
