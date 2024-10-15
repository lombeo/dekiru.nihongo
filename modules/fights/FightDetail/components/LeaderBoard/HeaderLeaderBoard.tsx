import React, { Fragment } from "react";
import { ActionIcon, Text, Tooltip } from "@mantine/core";
import { formatDateGMT, getAlphabetByPosition } from "@src/helpers/fuction-base.helpers";
import Icon from "@edn/font-icons/icon";
import Link from "@src/components/Link";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { DeviceFloppy, Edit } from "tabler-icons-react";
import clsx from "clsx";

interface HeaderLeaderBoardProps {
  activities: any;
  isTeam: boolean;
  contestId: number;
  isAdmin: boolean;
  isUpdateNote: boolean;
  onSetIsUpdateNote: (open: boolean) => void;
  isRegisterViewActivity: boolean;
  isRegistered: boolean;
}

const HeaderLeaderBoard = (props: HeaderLeaderBoardProps) => {
  const {
    isRegistered,
    isRegisterViewActivity,
    isUpdateNote,
    onSetIsUpdateNote,
    isTeam,
    isAdmin,
    contestId,
    activities,
  } = props;
  const { t } = useTranslation();

  const groupedBySubName = _.groupBy(activities, "subName");
  const groupedBySubNameMapped = _.flatMap(groupedBySubName, (activities, key) => {
    return {
      subName: key,
      activities: activities,
    };
  });

  const batches = groupedBySubNameMapped?.filter((e) => !_.isEmpty(e.subName) && e.subName !== "null");
  const activityNotInBatch = groupedBySubNameMapped?.flatMap((e) =>
    _.isEmpty(e.subName) || e.subName == "null" ? e.activities : []
  );

  const rowSpanHeader = batches?.length > 0 ? 3 : 2;

  let colSpanCodingColumn = 0;
  batches?.forEach((batch) => {
    if (batch.activities.length > 1) {
      colSpanCodingColumn += batch.activities.length + 1;
    } else {
      colSpanCodingColumn += 1;
    }
  });
  colSpanCodingColumn += activityNotInBatch?.length || 0;

  return (
    <thead>
      <tr>
        <th rowSpan={rowSpanHeader} style={{ width: 40 }}>
          {t("Rank")}
        </th>
        <th rowSpan={rowSpanHeader} style={{ minWidth: 200 }}>
          <div className="flex justify-center items-center gap-2">
            <div className="leading-[22px] h-[22px]">{isTeam ? t("Team") : t("User")} </div>
            {isAdmin ? (
              <>
                {isUpdateNote ? (
                  <ActionIcon variant="transparent" onClick={() => onSetIsUpdateNote(false)} color="dark" size="sm">
                    <DeviceFloppy width={16} />
                  </ActionIcon>
                ) : (
                  <ActionIcon variant="transparent" onClick={() => onSetIsUpdateNote(true)} color="dark" size="sm">
                    <Edit width={16} />
                  </ActionIcon>
                )}
              </>
            ) : null}
          </div>
        </th>
        {colSpanCodingColumn > 0 && <th colSpan={colSpanCodingColumn}>{t("FIGHT_CODING")}</th>}
        <th rowSpan={rowSpanHeader}>{t("FIGHT_TOTAL")}</th>
        {isAdmin ? <th rowSpan={rowSpanHeader} style={{ width: 70 }}></th> : null}
      </tr>

      {batches?.length > 0 && (
        <tr>
          {activityNotInBatch?.length > 0 && <th colSpan={activityNotInBatch.length}></th>}
          {batches.map((batch) => (
            <th
              className="min-w-[80px]"
              key={batch.subName}
              colSpan={batch.activities?.length > 1 ? batch.activities?.length + 1 : 1}
            >
              {batch.subName}
            </th>
          ))}
        </tr>
      )}

      <tr>
        {activityNotInBatch?.map((activity: any, indexActivity) => (
          <th key={activity.activityId} className="highlight min-w-[80px]">
            <Tooltip
              classNames={{ tooltip: "shadow-sm p-0" }}
              label={
                <div className="flex flex-col w-full items-start">
                  <Text
                    c="white"
                    ta="center"
                    fw="bold"
                    size="md"
                    style={{ background: "#B3CBD7" }}
                    className="py-2 px-3 w-full"
                  >
                    {getAlphabetByPosition(indexActivity)}
                  </Text>
                  <div className="mt-1 flex text-sm flex-col gap-1 items-start px-3 pb-2">
                    <Text tt="none" fw="400" c="yellow" className="flex gap-1 items-center h-6">
                      {activity.point} <Icon name="heart-filled" size={16} />
                    </Text>
                    <Text tt="none" fw="400" c="dark">
                      <Text c="gray" component="span">
                        {t("Start time")}:
                      </Text>{" "}
                      {formatDateGMT(activity.startTime, "HH:mm")} +07:00
                    </Text>
                    <Text tt="none" fw="400" c="dark">
                      <Text c="gray" component="span">
                        {t("Date")}:
                      </Text>{" "}
                      {formatDateGMT(activity.startTime)}
                    </Text>
                  </div>
                </div>
              }
              color="white"
              withArrow
              arrowSize={8}
            >
              <div>
                <Link
                  className={clsx("text-white hover:underline", {
                    "pointer-events-none": isRegisterViewActivity && !isRegistered && !isAdmin,
                  })}
                  href={`/fights/detail/${contestId}?activityId=${activity.activityId}&activityType=${activity.activityType}`}
                >
                  <Text>{getAlphabetByPosition(indexActivity)}</Text>
                  <Text>({activity.point})</Text>
                </Link>
              </div>
            </Tooltip>
          </th>
        ))}

        {batches?.map((batch) => (
          <Fragment key={batch.subName}>
            {batch.activities?.map((activity: any, indexActivity) => (
              <th key={activity.activityId} className="highlight">
                <Tooltip
                  classNames={{ tooltip: "shadow-sm p-0" }}
                  label={
                    <div className="flex flex-col w-full items-start">
                      <Text
                        c="white"
                        ta="center"
                        fw="bold"
                        size="md"
                        style={{ background: "#B3CBD7" }}
                        className="py-2 px-3 w-full"
                      >
                        {getAlphabetByPosition(indexActivity)}
                      </Text>
                      <div className="mt-1 flex text-sm flex-col gap-1 items-start px-3 pb-2">
                        <Text tt="none" fw="400" c="yellow" className="flex gap-1 items-center h-6">
                          {activity.point} <Icon name="heart-filled" size={16} />
                        </Text>
                        <Text tt="none" fw="400" c="dark">
                          <Text c="gray" component="span">
                            {t("Start time")}:
                          </Text>{" "}
                          {formatDateGMT(activity.startTime, "HH:mm")} +07:00
                        </Text>
                        <Text tt="none" fw="400" c="dark">
                          <Text c="gray" component="span">
                            {t("Date")}:
                          </Text>{" "}
                          {formatDateGMT(activity.startTime)}
                        </Text>
                      </div>
                    </div>
                  }
                  color="white"
                  withArrow
                  arrowSize={8}
                >
                  <div>
                    <Link
                      className={clsx("text-white hover:underline", {
                        "pointer-events-none": isRegisterViewActivity && !isRegistered && !isAdmin,
                      })}
                      href={`/fights/detail/${contestId}?activityId=${activity.activityId}&activityType=${activity.activityType}`}
                    >
                      <Text>{getAlphabetByPosition(indexActivity)}</Text>
                      <Text>({activity.point})</Text>
                    </Link>
                  </div>
                </Tooltip>
              </th>
            ))}
            {batch.activities?.length > 1 && <th className="highlight">{t("FIGHT_TOTAL")}</th>}
          </Fragment>
        ))}
      </tr>
    </thead>
  );
};

export default HeaderLeaderBoard;
