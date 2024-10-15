import { Button, Divider, Pagination, Text } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import Icon from "@edn/font-icons/icon";
import { Checkbox, Chip, Table } from "@mantine/core";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import RawText from "@src/components/RawText/RawText";
import { CourseType, CourseUserRole } from "@src/constants/courses/courses.constant";
import UserRole from "@src/constants/roles";
import { useProfileContext } from "@src/context/Can";
import { useHasAnyRole } from "@src/helpers/helper";
import { LearnActivityService } from "@src/services";
import { LearnExportServices } from "@src/services/LearnExportService";
import { isEmpty, isNil } from "lodash";
import moment from "moment";
import { useTranslation } from "next-i18next";
import React, { useEffect, useRef, useState } from "react";
import styles from "./ScratchActivity.module.scss";
import GradeModal from "./components/GradeModal";
import ScratchEditor from "./components/ScratchEditor";

interface ScratchActivityProps {
  data: any;
  permalink: any;
  refetch: () => any;
  isExpired: boolean;
}

const ScratchActivity = (props: ScratchActivityProps) => {
  const { data, refetch, permalink, isExpired } = props;

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

  const isGradeScratch =
    !!profile?.userId &&
    data &&
    (data.courseUsers.some((e) => e.userId == profile?.userId && e.role === CourseUserRole.GradeAssignment) || isOwner);

  const [showEditor, setShowEditor] = useState(false);
  const [openGradeModal, setOpenGradeModal] = useState(false);
  const [listSubmission, setListSubmission] = useState<any>(null);
  const [filter, setFilter] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [submission, setSubmission] = useState<any>(null);
  const refSelectedSubmissionItem = useRef<any>(null);
  const [selected, setSelected] = useState([]);
  const [loadingDownload, setLoadingDownload] = useState(false);

  const fetchSubmission = async () => {
    if (isGradeScratch || isManager) return;
    const res = await LearnActivityService.getSubmissionScratch({
      activityId: data.activityId,
    });
    setSubmission(res?.data?.data);
  };

  const fetchSubmissionForTeacher = async () => {
    if (!isGradeScratch && !isManager) return;
    const res = await LearnActivityService.getListSubmissionScratch({
      activityId: data.activityId,
      courseType: CourseType.Personal,
      ...filter,
    });
    setListSubmission(res?.data);
    setSelected([]);
  };

  useEffect(() => {
    fetchSubmission();
  }, []);

  useEffect(() => {
    fetchSubmissionForTeacher();
  }, [filter]);

  const disabledSubmit = !isEmpty(submission?.point) || !isEmpty(submission?.comment);

  const handleDownload = async () => {
    setLoadingDownload(true);
    const res = await LearnExportServices.exportScratchZip({
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
      {showEditor && (
        <ScratchEditor
          title={data?.activityData.title}
          description={description}
          activityId={data.activityId}
          submissionId={submission?.id}
          type={isGradeScratch || isManager ? "view" : "default"}
          defaultValue={refSelectedSubmissionItem.current}
          onClose={() => setShowEditor(false)}
          onSubmitted={() => {
            setTimeout(() => {
              refetch();
              fetchSubmission();
            }, 500);
            setShowEditor(false);
          }}
        />
      )}
      {openGradeModal && (
        <GradeModal
          data={data}
          selected={refSelectedSubmissionItem.current}
          onSuccess={() => fetchSubmissionForTeacher()}
          activityId={data.activityId}
          onClose={() => setOpenGradeModal(false)}
        />
      )}
      <Container>
        <div className="py-5">
          <Text className="font-semibold mb-3">{t("Content")}</Text>
          <RawText content={description} className="overflow-auto break-words mt-3 max-w-full" />
          {files?.length > 0 && (
            <>
              <Text className="font-semibold mb-3 mt-6">{t("Additional files")}</Text>
              <div className="bg-[#F1F3F5] px-4 py-2 rounded-md min-h-[50px] flex flex-col justify-center">
                {!data.activityData?.metadata?.files?.length && !data.activityData?.metadata?.fileName && (
                  <span>--</span>
                )}
                {!data.activityData?.metadata?.files?.length && data.activityData.metadata.fileName && (
                  <a
                    className="text-navy-primary hover:underline"
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
                        className="flex items-center gap-2 py-1 text-navy-primary hover:underline"
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
          {!isGradeScratch && !isManager && !!profile && isEnrolled ? (
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
          <Button
            disabled={disabledSubmit || !isEnrolled || !data}
            onClick={() => {
              if (submission) {
                refSelectedSubmissionItem.current = submission;
              } else {
                refSelectedSubmissionItem.current = null;
              }
              setShowEditor(true);
            }}
            className="mt-4"
          >
            {t("ScratchPage.Start")}
          </Button>
          {!isGradeScratch && !isManager && !!profile && isEnrolled && (
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
                      className="text-navy-primary cursor-pointer flex gap-2 items-center"
                      href={submission.fileGradeURL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {submission.fileGradeName ? (
                        "File"
                      ) : (
                        <TextLineCamp className="!break-all hover:underline">{submission.fileGradeURL}</TextLineCamp>
                      )}
                      <span className="text-navy-primary inline-flex items-center flex-none">
                        <Icon name="download" size={22} />
                      </span>
                    </a>
                  </div>
                </>
              )}
            </>
          )}
          {(isGradeScratch || isManager) && (
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
                  <thead>
                    <tr>
                      <th className="!text-center w-[40px]"></th>
                      <th>{t("No.")}</th>
                      <th className="max-w-[180px]">{t("Student")}</th>
                      <th>{t("Submission time")}&nbsp;(GMT+07)</th>
                      <th>
                        {t("Point (Max: {{point}})", {
                          point: data.activityData?.metadata?.maxScore,
                        })}
                      </th>
                      <th>{t("TEACHER_COMMENT")}</th>
                      {isGradeScratch && <th className="!text-center">{t("Actions")}</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {listSubmission?.data?.map((item: any, idx) => {
                      const className = idx % 2 ? styles["rowNth"] : "bg-[#f8f9fa]";
                      const checked = selected.some((e) => e.userId === item.userId);
                      const isLateSubmission =
                        data.activityData?.metadata?.dueDate &&
                        moment(item.submitted, "HH:mm DD/MM/YYYY").isAfter(
                          moment(data.activityData?.metadata?.dueDate)
                        );

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
                              <Link href={`/profile/${item.userId}`}>
                                <TextLineCamp className="text-navy-primary hover:underline cursor-pointer">
                                  {item.fullName || item.email}
                                </TextLineCamp>
                              </Link>
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
                            <td>{item.point}</td>
                            <td>{item.comment}</td>
                            {isGradeScratch && (
                              <td className="min-w-[100px] flex items-center justify-center gap-3">
                                <div
                                  onClick={() => {
                                    refSelectedSubmissionItem.current = item;
                                    setShowEditor(true);
                                  }}
                                  className="text-navy-primary hover:underline cursor-pointer"
                                >
                                  {t("Xem")}
                                </div>
                                <div
                                  onClick={() => {
                                    refSelectedSubmissionItem.current = item;
                                    setOpenGradeModal(true);
                                  }}
                                  className="text-navy-primary hover:underline cursor-pointer"
                                >
                                  {t("Grade")}
                                </div>
                                <a
                                  className="text-navy-primary hover:underline cursor-pointer"
                                  href={item.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <TextLineCamp className="max-w-[200px]">{t("Download")}</TextLineCamp>
                                </a>
                              </td>
                            )}
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
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
export default ScratchActivity;
