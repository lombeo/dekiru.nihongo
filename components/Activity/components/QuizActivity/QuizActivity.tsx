import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Button, Checkbox, Group, Radio } from "@mantine/core";
import { useActivityContext } from "@src/components/Activity/context";
import { cookieEvaluate } from "@src/constants/evaluate/evaluate.constant";
import { convertDate } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage } from "@src/helpers/helper";
import CodingService from "@src/services/Coding/CodingService";
import { ActivityContextType } from "@src/services/Coding/types";
import { selectProfile } from "@src/store/slices/authSlice";
import clsx from "clsx";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector } from "react-redux";
import { DeviceFloppy, Edit, Refresh } from "tabler-icons-react";
import styles from "./QuizActivity.module.scss";

const QuizActivity = (props) => {
  const { t } = useTranslation();
  const { notShowEdit } = props;

  const {
    diffTime,
    quizActivity,
    contextData,
    reFetchContextData,
    activityId,
    contextId,
    contextType,
    token,
    isAdminContext,
    isNotStart,
    activities,
    chapters,
    hideSubmit,
    setHideSubmit,
  } = useActivityContext();
  const profile = useSelector(selectProfile);

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const [value, setValue] = useState<any>(
    quizActivity?.quizAnswers?.flatMap((e) => (e.isChecked ? e.uniqueId : [])) || []
  );
  const [isLoading, setIsLoading] = useState(false);

  if (!quizActivity) return null;

  const now = moment().subtract(diffTime);
  const isInTimeContest =
    !!contextData &&
    now.isSameOrAfter(convertDate(contextData.startDate)) &&
    now.isBefore(convertDate(contextData.endTimeCode));

  const answers = quizActivity.quizAnswers || [];
  const isMultiChoice = quizActivity.isMultiChoice;

  const currentIndex = activities?.findIndex((item: any) => item.activityId === activityId);
  const nextActivity = activities && currentIndex < activities.length && activities[currentIndex + 1];
  const nextActivityURL = `/fights/detail/${contextId}?activityType=${nextActivity?.activityType}&activityId=${nextActivity?.activityId}`;

  const correctChoices = quizActivity.correctChoices?.split(",") || [];
  const index = chapters.findIndex((item) => item.id == activities[currentIndex]?.activityId);
  const handleSubmit = async () => {
    setIsLoading(true);
    if (contextType === ActivityContextType.Evaluating) {
      const res = await CodingService.evaluateSubmitQuiz({
        activityId,
        contextId,
        contextType,
        answers: value,
        token: token,
        cookie: cookieEvaluate,
      });
      if (res?.data?.success) {
        setHideSubmit(true);
        if (res?.data?.data?.isShowResult) {
          const isPassed = res?.data?.data?.isPassed;
          confirmAction({
            message: `${isPassed ? t("You answered correctly.") : t("You answered incorrectly.")} ${
              nextActivity
                ? t("Do you want to move on to another task?")
                : chapters[index + 1]
                ? t("Next chapter?")
                : t("Back to evaluate")
            }`,
            title: t("Notice"),
            labelConfirm: t("Ok"),
            onConfirm: () => {
              nextActivity
                ? router.push(
                    `/evaluating/detail/${contextId}/${nextActivity.activityId}?activityId=${
                      nextActivity.activityId
                    }&activityType=${nextActivity?.activityType}${token ? "&token=" + token : ""}`
                  )
                : chapters[index + 1]
                ? router.push(
                    `/evaluating/detail/${contextId}/${chapters[currentIndex]?.id}?activityId=${
                      chapters[index + 1]?.id
                    }&activityType=${chapters[index + 1]?.activityType}${token ? "&token=" + token : ""}`
                  )
                : router.push(`/evaluating/detail/${contextId}${token ? "?token=" + token : ""}`);
            },
          });
        } else {
          const isPassed = res?.data?.data?.isPassed;
          confirmAction({
            message: `${
              nextActivity
                ? t("Do you want to move on to another task?")
                : chapters[index + 1]
                ? t("Next chapter?")
                : t("Back to evaluate")
            }`,
            title: t("Notice"),
            labelConfirm: t("Ok"),
            onConfirm: () => {
              nextActivity
                ? router.push(
                    `/evaluating/detail/${contextId}/${chapters[currentIndex]?.id}?activityId=${
                      chapters[index + 1]?.id
                    }&activityType=${chapters[index + 1]?.activityType}${token ? "&token=" + token : ""}`
                  )
                : chapters[index + 1]
                ? router.push(
                    `/evaluating/detail/${contextId}/${nextActivity.activityId}?activityId=${
                      nextActivity.activityId
                    }&activityType=${nextActivity?.activityType}${token ? "&token=" + token : ""}`
                  )
                : router.push(`/evaluating/detail/${contextId}/${token ? "?token=" + token : ""}`);
            },
          });
        }
      } else {
        Notify.error(t(res?.data?.message));
      }
      reFetchContextData();

      setIsLoading(false);
    } else {
      const res = await CodingService.contestSubmitQuiz({
        activityId,
        contextId,
        contextType,
        answers: value,
      });
      setIsLoading(false);
      const message = res?.data?.message;
      if (res?.data?.success) {
        setHideSubmit(true);
        reFetchContextData();
        const isPassed = res?.data?.data?.isPassed;
        confirmAction({
          message: `${isPassed ? t("You answered correctly.") : t("You answered incorrectly.")} ${
            nextActivity ? t("Do you want to move on to another task?") : ""
          }`,
          title: t("Notice"),
          labelConfirm: t("Ok"),
          onConfirm: () => {
            nextActivity && router.push(nextActivityURL);
          },
        });
      } else if (message) {
        Notify.error(t(message));
      }
    }
  };

  let disabledSubmit = !isAdminContext && (!value || value.length <= 0 || !isInTimeContest || isNotStart);
  if (contextType === ActivityContextType.Evaluating) {
    disabledSubmit = false;
  }

  const radioValue = isAdminContext ? correctChoices?.[0] : value?.[0];

  return (
    <div
      className={clsx("bg-[#1E2026] h-full overflow-hidden relative", {
        "pb-[42px]": !!profile,
      })}
    >
      {profile ? (
        <Group position="right" className="bg-[#232532] py-[6px] px-3 w-full">
          <Button
            onClick={() => {
              if (!isAdminContext) {
                confirmAction({
                  title: t("CONFIRMATION"),
                  labelConfirm: t("Yes"),
                  message: t("Are you sure you want to reset your choices?"),
                  onConfirm: () => {
                    setValue([]);
                  },
                });
              }
            }}
            leftIcon={<Refresh width={16} />}
            size="xs"
            className="text-sm bg-[#3B3D54]"
            color="gray"
          >
            {t("Reset")}
          </Button>
        </Group>
      ) : null}
      <div
        className={clsx("py-3 px-5 overflow-y-auto", {
          "h-[calc(100%_-_42px)]": !!profile,
          "h-full": !profile,
        })}
      >
        <div className={styles.root}>
          {isMultiChoice ? (
            <Checkbox.Group
              className={clsx({
                "cursor-not-allowed": isAdminContext,
              })}
              classNames={{ root: "gap-5 flex flex-col" }}
              onChange={setValue}
              key={`${new Date()}`}
              value={isAdminContext ? correctChoices : value}
            >
              {answers.map((item: any) => {
                let content = resolveLanguage(item, locale)?.content;

                return (
                  <Checkbox
                    className={clsx("items-start", styles["answer-item-checkbox"], {
                      "pointer-events-none":
                        isAdminContext || (!profile && contextType != ActivityContextType.Evaluating),
                      // isAnsweredCorrect: isAnsweredCorrect,
                      // isAnsweredInCorrect: isAnsweredInCorrect,
                    })}
                    key={`${item.uniqueId}-${new Date()}`}
                    value={item.uniqueId}
                    classNames={{
                      inner: "mr-3 mt-[2px] pt-5",
                      label: "text-white py-5 w-full",
                      input: "border-2 !border-[#fff]",
                      labelWrapper: "w-full",
                      body: "px-8 w-full",
                      root: "bg-[#2d313e] hover:opacity-80 rounded-[3px] cursor-pointer",
                    }}
                    label={
                      <div style={{ marginTop: "-2px", wordBreak: "break-word" }} className="pl-2 text-base">
                        <div dangerouslySetInnerHTML={{ __html: content }}></div>
                      </div>
                    }
                  />
                );
              })}
            </Checkbox.Group>
          ) : (
            <Radio.Group
              className={clsx({
                "cursor-not-allowed": isAdminContext,
              })}
              classNames={{ root: "gap-5 flex flex-col" }}
              onChange={(val) => setValue([val])}
              key={`${new Date()}`}
              value={radioValue}
            >
              {answers.map((item: any) => {
                let content = resolveLanguage(item, locale)?.content;

                // const isAnsweredCorrect = item.isCorrect && item.selected;
                // const isAnsweredInCorrect = !item.isCorrect && item.selected;
                return (
                  <Radio
                    className={clsx("items-start", styles["answer-item"], {
                      "pointer-events-none":
                        isAdminContext || (!profile && contextType != ActivityContextType.Evaluating),
                      // isAnsweredCorrect: isAnsweredCorrect,
                      // isAnsweredInCorrect: isAnsweredInCorrect,
                    })}
                    classNames={{
                      radio: "w-4 h-4 border-2 border-[#fff]",
                      inner: "mr-3 mt-[5px] pt-5",
                      label: "text-white py-5 w-full",
                      labelWrapper: "w-full",
                      body: "px-8 w-full",
                      root: "bg-[#2d313e] hover:opacity-80 rounded-[3px] cursor-pointer",
                    }}
                    key={`${item.uniqueId}-${new Date()}`}
                    value={item.uniqueId}
                    label={
                      <div style={{ wordBreak: "break-word" }} className="pl-2 text-base">
                        <div dangerouslySetInnerHTML={{ __html: content }}></div>
                      </div>
                    }
                  />
                );
              })}
            </Radio.Group>
          )}
        </div>
      </div>
      {(profile || contextType == ActivityContextType.Evaluating) && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-[#232532]">
          <Group position="right" spacing="xs" className="bg-[#232532] py-[6px] px-3 w-full">
            {isAdminContext && (
              <Button
                onClick={() => {
                  window.open(`/cms/activities?activityType=${8}&activityId=${quizActivity?.activity?.externalCode}`);
                }}
                leftIcon={<Edit width={16} />}
                size="xs"
                className="text-sm"
              >
                {t("Edit task")}
              </Button>
            )}
            {!hideSubmit && (
              <Button
                leftIcon={<DeviceFloppy width={16} />}
                size="xs"
                className={clsx("text-sm", {
                  "opacity-60 cursor-not-allow pointer-events-none": disabledSubmit,
                  hidden: contextType === ActivityContextType.Warehouse,
                })}
                color="green"
                onClick={handleSubmit}
                loading={isLoading}
              >
                {t("Submit")}
              </Button>
            )}
          </Group>
        </div>
      )}
    </div>
  );
};

export default QuizActivity;
