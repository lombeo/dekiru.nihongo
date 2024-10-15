import { Button, Divider, Pagination, Text } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import Icon from "@edn/font-icons/icon";
import { ActionIcon, Checkbox, Chip, Table, Image } from "@mantine/core";
import { Container } from "@src/components";
import RawText from "@src/components/RawText/RawText";
import { CourseType, CourseUserRole } from "@src/constants/courses/courses.constant";
import UserRole from "@src/constants/roles";
import { useProfileContext } from "@src/context/Can";
import { useHasAnyRole } from "@src/helpers/helper";
import { LearnActivityService } from "@src/services/LearnActivityService";
import { LearnClassesService } from "@src/services/LearnClassesService";
import { LearnExportServices } from "@src/services/LearnExportService";
import clsx from "clsx";
import { isEmpty, isNil } from "lodash";
import moment from "moment";
import { useTranslation } from "next-i18next";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./AssignmentActivity.module.scss";
import CommentAssignmentModal from "./components/CommentAssignmentModal";
import GradeAssignmentModal from "./components/GradeAssignmentModal";
import SubmitAssignmentModal from "./components/SubmitAssignmentModal";
import { ChatChanelEnum } from "@chatbox/constants";

interface AssignmentActivityProps {
  data: any;
  permalink: any;
  refetch: () => any;
  isExpired: boolean;
}

const AssignmentActivity = (props: AssignmentActivityProps) => {
  const { data, refetch, isExpired } = props;
  const { t } = useTranslation();

  const { profile } = useProfileContext();
  const isEnrolled = data?.isEnrolled;

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);

  const isOwner = profile && data && profile.userId === data.courseOwner?.userId;

  const isManager =
    isOwner ||
    isManagerContent ||
    (profile &&
      data &&
      data?.courseUsers &&
      data.courseUsers.some(
        (e) => e.userId == profile.userId && [CourseUserRole.CourseManager, CourseUserRole.ViewReport].includes(e.role)
      ));

  const isGradeAssignment =
    !!profile?.userId &&
    data &&
    (data.courseUsers.some((e) => e.userId == profile?.userId && e.role === CourseUserRole.GradeAssignment) || isOwner);

  const [openModal, setOpenModal] = useState<
    "GradeAssignmentModal" | "SubmitAssignmentModal" | "CommentAssignmentModal" | null
  >(null);

  const [listSubmission, setListSubmission] = useState<any>(null);
  const [filter, setFilter] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [submission, setSubmission] = useState<any>(null);
  const [selectedSubmissionItem, setSelectedSubmissionItem] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loadingDownload, setLoadingDownload] = useState(false);

  const fetchSubmission = useCallback(async () => {
    if (isGradeAssignment || isManager) return;
    const res = await LearnActivityService.getSubmissionAssignment({
      activityId: data.activityId,
    });
    setSubmission(res?.data?.data);
  }, [data.activityId]);

  const fetchSubmissionForTeacher = useCallback(async () => {
    if (!isGradeAssignment && !isManager) return;
    const res = await LearnActivityService.getListSubmissionAssignment({
      activityId: data.activityId,
      courseType: CourseType.Personal,
      ...filter,
    });
    setListSubmission(res?.data);
    setSelected([]);
  }, [data.activityId, filter]);

  useEffect(() => {
    fetchSubmission();
  }, [fetchSubmission]);

  useEffect(() => {
    fetchSubmissionForTeacher();
  }, [fetchSubmissionForTeacher]);

  const ths = (
    <tr>
      <th className="!text-center"></th>
      <th>{t("No.")}</th>
      <th className="max-w-[180px]">{t("Student")}</th>
      <th>{t("Submission time")}&nbsp;(GMT+07)</th>
      <th>{t("File/Link assignment")}</th>
      <th>{t("Description")}</th>
      <th>
        {t("Point (Max: {{point}})", {
          point: data.activityData?.metadata?.maxScore,
        })}
      </th>
      <th>{t("TEACHER_COMMENT")}</th>
      {isGradeAssignment && <th className="!text-center">{t("Action")}</th>}
    </tr>
  );

  const rows = listSubmission?.data?.map((item: any, idx) => {
    const className = idx % 2 ? styles["rowNth"] : "bg-[#f8f9fa]";
    const checked = selected.some((e) => e.userId === item.userId);
    const isLateSubmission =
      data.activityData?.metadata?.dueDate &&
      moment(item.submitted, "HH:mm DD/MM/YYYY").isAfter(moment(data.activityData?.metadata?.dueDate));

    return (
      <React.Fragment key={item.userId}>
        <tr className={className}>
          <td className="text-center">
            <Checkbox
              checked={checked}
              disabled={isEmpty(item.fileName)}
              onChange={(e) =>
                checked
                  ? setSelected((prev) => prev.filter((e) => e.userId !== item.userId))
                  : setSelected((prev) => [...prev, item])
              }
            />
          </td>
          <td>{idx + 1}</td>
          <td className="max-w-[180px]">
            <TextLineCamp>{item.fullName || item.email}</TextLineCamp>
          </td>
          <td>
            <div className="flex flex-col gap-3">
              {isLateSubmission && (
                <Chip
                  classNames={{ iconWrapper: "hidden", label: "text-[#EB5757] font-semibold" }}
                  checked
                  color="orange"
                  variant="filled"
                  radius="xs"
                >
                  {t("Late submission")}
                </Chip>
              )}
              {item.submitted
                ? moment(item.submitted, "HH:mm DD/MM/YYYY").add(7, "hour").format("HH:mm DD/MM/YYYY")
                : null}
            </div>
          </td>
          <td>
            <a
              className="text-blue-primary hover:underline cursor-pointer"
              href={item.fileUrl}
              target="_blank"
              rel="noreferrer"
            >
              <TextLineCamp className="max-w-[200px]">{!isEmpty(item.fileName) ? "File" : item.fileUrl}</TextLineCamp>
            </a>
          </td>
          <td>{item.shortDescription}</td>
          <td>{item.point}</td>
          <td>{item.comment}</td>
          {isGradeAssignment && (
            <td className="min-w-[180px] text-center">
              <div className="flex items-center justify-center gap-3 ">
                <div
                  onClick={() => {
                    setSelectedSubmissionItem(item);
                    setOpenModal("CommentAssignmentModal");
                  }}
                  className={clsx("text-blue-primary cursor-pointer")}
                >
                  {t("TEACHER_COMMENT")}
                </div>
                <div
                  onClick={() => {
                    setSelectedSubmissionItem(item);
                    setOpenModal("GradeAssignmentModal");
                  }}
                  className={clsx("text-blue-primary cursor-pointer")}
                >
                  {t("Grade")}
                </div>
                <ActionIcon
                  className="shadow-[0_4px_4px_rgba(0,0,0,0.25)] relative"
                  radius="xl"
                  onClick={() => {
                    handleChatStudent(item);
                  }}
                >
                  <Image alt="" src="/images/chat.png" fit="cover" height={24} width={24} />
                </ActionIcon>
              </div>
            </td>
          )}
        </tr>
      </React.Fragment>
    );
  });

  const handleChatStudent = (data) => {
    const userId = profile?.userId;
    const dataChatBox = {
      id: userId > data?.userId ? `${data?.userId}_${userId}` : `${userId}_${data?.userId}`,
      lastMessageTimestamp: new Date(),
      friend: {
        id: data.userId,
        username: data?.userName,
        fullName: data?.fullName,
        avatarUrl: data?.avatarUrl,
      },
      ownerId: -1,
      notifyCount: 0,
    };
    PubSub.publish(ChatChanelEnum.OPEN_CHAT, { data: dataChatBox });
  };

  const handleStart = () => {
    confirmAction({
      message: "Are you sure to start the assignment?",
      onConfirm: async () => {
        const res = await LearnClassesService.startActivity({
          courseId: data.courseId,
          activityId: data.activityId,
          classId: 0,
          duration: 0,
          courseType: CourseType.Personal,
          IsNotLimitedTimeComments: true,
          InteractOption: "VoteAndComment",
        });
        if (res.data.success) {
          Notify.success(t("Started successfully! Please wait a second!"));
          refetch();
        }
      },
    });
  };

  const disabledSubmit = !isEmpty(submission?.point) || data.activityData?.metadata?.startDate == null;

  const handleDownload = async () => {
    setLoadingDownload(true);
    const res = await LearnExportServices.exportAssignmentZip({
      classId: 0,
      slotNumber: "",
      subjectCode: "",
      courseType: CourseType.Personal,
      listFiles: selected.map((e) => ({
        FileNameS3: `${e.email}_` + e.fileName,
        fileName: `${e.email}_` + e.fileName,
        userId: e.userId,
        fileUrl: e.fileUrl,
        fullName: e.fullName,
      })),
    });
    setLoadingDownload(false);
    if (res?.data.code == 200 && res.data.data) {
      const a = document.createElement("a");
      a.href = res.data.data;
      a.click();
      setSelected([]);
    } else if (res?.data.message) {
      Notify.error(t(res.data.message));
    }
  };
  const isRestart =
    data.activityData?.metadata?.dueDate && moment(data.activityData?.metadata?.dueDate).isSameOrBefore(new Date());
  const isLateSubmission =
    submission &&
    data.activityData?.metadata?.dueDate &&
    moment(data.activityData?.metadata?.dueDate).isSameOrBefore(submission.submitted);

  let files = [];
  if (data?.activityData?.metadata?.files) {
    try {
      files = JSON.parse(data.activityData.metadata.files);
    } catch (e) {}
  }

  const isHavePoint = submission && !isNil(submission?.point) && submission.point !== "";
  const isPending = submission && (isNil(submission?.point) || submission.point == "");
  const isPassed =
    !isNil(submission?.point) && submission.point !== "" && submission.point >= data.activityData?.metadata?.passScore;

  const description = data.activityData?.description;

  return (
    <div>
      {openModal === "SubmitAssignmentModal" && (
        <SubmitAssignmentModal
          title={
            <TextLineCamp>
              {t("Submission")}: {data.activityData?.title}
            </TextLineCamp>
          }
          open
          submission={submission}
          onSuccess={() => fetchSubmission()}
          activityId={data.activityId}
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === "GradeAssignmentModal" && (
        <GradeAssignmentModal
          data={data}
          selected={selectedSubmissionItem}
          onSuccess={() => fetchSubmissionForTeacher()}
          activityId={data.activityId}
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === "CommentAssignmentModal" && (
        <CommentAssignmentModal
          data={data}
          selected={selectedSubmissionItem}
          onSuccess={() => fetchSubmissionForTeacher()}
          activityId={data.activityId}
          onClose={() => setOpenModal(null)}
        />
      )}
      <Container>
        <div className="py-5">
          <Text className="font-semibold mb-3">{t("Content")}</Text>
          <div className="bg-blue-light p-4 pl-6 border-l-8 border-blue-primary max-w-full">
            <RawText content={description} className="break-words mt-3 max-w-full" />
          </div>
          {data.activityData?.metadata?.files?.length && !data.activityData?.metadata?.fileName && (
            <>
              <Text className="font-semibold mb-3 mt-6">{t("Additional files")}</Text>
              <div className="bg-[#F1F3F5] px-4 py-2 rounded-md min-h-[50px] flex flex-col justify-center">
                {data.activityData?.metadata?.fileName && (
                  <a
                    className="text-blue-primary hover:underline"
                    target="_blank"
                    href={data.activityData?.metadata?.fileUrl}
                    rel="noreferrer"
                  >
                    {data.activityData?.metadata?.fileName}
                  </a>
                )}
                {files && Object.keys(files).length > 0
                  ? Object.keys(files).map((key) => (
                      <a
                        key={key}
                        className="flex items-center gap-2 py-1 text-blue-primary hover:underline"
                        target="_blank"
                        href={files[key]}
                        rel="noreferrer"
                        download="file"
                      >
                        {key}
                      </a>
                    ))
                  : "--"}
              </div>
            </>
          )}
          <Text className="text-md font-semibold mt-6">
            <span>{t("Pass score")}:</span>{" "}
            <span className="font-semibold">
              {data.activityData?.metadata?.passScore}/{data.activityData?.metadata?.maxScore}
            </span>
          </Text>
          {!isGradeAssignment && !isManager && !!profile && isEnrolled ? (
            <Text className="text-md font-semibold mt-3">
              <span>{t("My point")}:</span>&nbsp;
              <span className="font-semibold">
                {isHavePoint ? submission.point : "--"}/{data.activityData?.metadata?.maxScore}
                {isHavePoint && (
                  <>
                    &nbsp;-&nbsp;{isPassed ? <span className="text-green-500">{t("Passed")}</span> : null}
                    {isPending ? <span className="text-gray-500">{t("Not yet graded")}</span> : null}
                    {!isPending && !isPassed ? <span className="text-red-500">{t("Failed")}</span> : null}
                  </>
                )}
              </span>
            </Text>
          ) : null}
          {isManager && (!data.activityData?.metadata?.startDate || isRestart) ? (
            <Button onClick={handleStart} className="mt-4">
              {isRestart ? t("Re-start") : t("Start")}
            </Button>
          ) : null}
          {!isGradeAssignment && !isManager && !!profile && isEnrolled && (
            <>
              <Divider className="mt-6 pb-4" />
              <Text className="font-semibold">{t("My assignment")}</Text>
              <div className="mt-4 grid grid-cols-2 gap-5">
                <div className="bg-[#F1F3F5] p-4 rounded-md">
                  <Text className="mb-2">{t("Submission status")}:</Text>
                  {submission && !isLateSubmission ? (
                    <Chip
                      classNames={{ iconWrapper: "hidden", label: "text-[#38CB89] font-semibold" }}
                      checked
                      color="green"
                      variant="filled"
                      radius="xs"
                    >
                      {t("Submitted")}
                    </Chip>
                  ) : null}
                  {submission && isLateSubmission ? (
                    <Chip
                      classNames={{ iconWrapper: "hidden", label: "text-[#EB5757] font-semibold" }}
                      checked
                      color="orange"
                      variant="filled"
                      radius="xs"
                    >
                      {t("Late submission")}
                    </Chip>
                  ) : null}
                  {!submission && (
                    <Chip
                      classNames={{
                        iconWrapper: "hidden",
                        label: "text-[#EB5757] font-semibold !bg-[#FCE6E6]",
                      }}
                      checked
                      color="green"
                      variant="filled"
                      radius="xs"
                    >
                      {t("Not submit")}
                    </Chip>
                  )}
                </div>
                <div className="bg-[#F1F3F5] p-4 rounded-md">
                  <Text className="mb-2">{t("Submission time")}:</Text>
                  <Text>
                    {submission?.submitted
                      ? moment(submission.submitted).add(7, "hour").format("HH:mm DD/MM/YYYY") + " (GMT+07)"
                      : "--"}
                  </Text>
                </div>
                <div className="bg-[#F1F3F5] p-4 rounded-md">
                  <Text className="mb-2">{t("Description")}:</Text>
                  <TextLineCamp line={10}>{submission?.shortDescription || "--"}</TextLineCamp>
                </div>
                <div className="bg-[#F1F3F5] p-4 rounded-md">
                  <Text className="mb-2">{t("File/Link assignment")}:</Text>
                  {submission?.fileUrl ? (
                    <a
                      className="text-blue-primary cursor-pointer flex gap-2 items-center"
                      href={submission.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <TextLineCamp className="!break-all hover:underline">{submission.fileUrl}</TextLineCamp>
                      <span className="text-blue-primary inline-flex items-center flex-none">
                        <Icon name="download" size={22} />
                      </span>
                    </a>
                  ) : null}
                  {!isGradeAssignment && !isManager && !disabledSubmit && !isExpired && (
                    <Button onClick={() => setOpenModal("SubmitAssignmentModal")} size="sm">
                      {submission ? t("Re-Submit") : t("Submit assignment")}
                    </Button>
                  )}
                </div>
              </div>
              <Divider className="mt-6 pb-4" />
              <Text className="font-semibold mb-3">{t("Teacher comment")}</Text>
              <div className="mb-4 bg-[#F1F3F5] px-4 py-2 rounded-md min-h-[50px] flex flex-col justify-center">
                <Text>{submission?.comment || "--"}</Text>
              </div>
              {!!submission?.fileGradeURL && (
                <>
                  <Text className="font-semibold mb-3 mt-6">{t("Additional files")}</Text>
                  <div className="mb-4 bg-[#F1F3F5] px-4 py-2 rounded-md min-h-[50px] flex flex-col justify-center">
                    <a
                      className="text-blue-primary cursor-pointer flex gap-2 items-center"
                      href={submission.fileGradeURL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {submission.fileGradeName ? (
                        "File"
                      ) : (
                        <TextLineCamp className="!break-all hover:underline">{submission.fileGradeURL}</TextLineCamp>
                      )}
                      <span className="text-blue-primary inline-flex items-center flex-none">
                        <Icon name="download" size={22} />
                      </span>
                    </a>
                  </div>
                </>
              )}
            </>
          )}
          {(isGradeAssignment || isManager) && (
            <>
              <Divider className="mt-6 pb-6" />
              <Text className="font-semibold">{t("Submissions")}</Text>
              <Button
                onClick={handleDownload}
                loading={loadingDownload}
                disabled={selected.length <= 0}
                className="mt-4"
              >
                {t("Download")}
              </Button>
              <div className="overflow-auto">
                <Table captionSide="bottom" striped withBorder withColumnBorders className="mt-4">
                  <thead>{ths}</thead>
                  <tbody>{rows}</tbody>
                </Table>
              </div>
              {listSubmission ? (
                <div className="mt-8 pb-8">
                  <Pagination
                    pageIndex={filter.pageIndex}
                    currentPageSize={listSubmission?.data?.length}
                    totalItems={listSubmission?.metaData?.total}
                    totalPages={listSubmission?.metaData?.pageTotal}
                    label={" "}
                    pageSize={filter.pageIndex}
                    onChange={(page) => setFilter((prev) => ({ ...prev, pageIndex: page }))}
                  />
                </div>
              ) : (
                <Text className="p-12 bg-white text-center text-gray-secondary">{t("No results found")}</Text>
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  );
};
export default AssignmentActivity;
