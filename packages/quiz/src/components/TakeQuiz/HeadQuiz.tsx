import { Button } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import Icon from "@edn/font-icons/icon";
import { Divider, Tooltip } from "@mantine/core";
import { ActivityStatusEnum } from "@src/constants/activity/activity.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useRouter } from "@src/hooks/useRouter";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { Check } from "tabler-icons-react";

const HeadQuiz = (props: any) => {
  const {
    title,
    permalink,
    onSubmit,
    isReview = false,
    onCloseReview,
    onBackQuiz,
    visibleSubmitBtn = true,
    isShowButtonSubmit = false,
    activities,
  } = props;
  const { t } = useTranslation();
  const activityId: any = +FunctionBase.getParameterByName("activityId");
  const router = useRouter();

  const getHeaderQuiz = () => {
    if (!isReview) {
      return (
        <div className="flex items-center">
          {/*{visibleCountDownTimer && (*/}
          {/*  <QuizCountDown onDoneCounDown={() => onSubmit({ skipConfirm: true })} time={time} />*/}
          {/*)}*/}
          {visibleSubmitBtn && (
            <>
              {isShowButtonSubmit && (
                <>
                  <Divider className="ml-6 mr-6" sx={{ height: "60px" }} orientation="vertical" />
                  <Button onClick={onSubmit} className="uppercase px-6 py-1" size="md">
                    {t("Submit")}
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      );
    } else {
      return (
        <div onClick={onCloseReview}>
          <Icon className="text-white hover:opacity-80 cursor-pointer" size={30} name="close" />
        </div>
      );
    }
  };

  return (
    <>
      <div className="bg-[#0E2643] text-sm text-white px-4 flex items-center h-[60px] gap-6 justify-between">
        <div onClick={onBackQuiz} className="font-semibold text-inherit flex items-center gap-3 cursor-pointer hover:opacity-80">
          <div className="flex">
            <Image alt="chevron_left" src="/images/learning/chevron_left.png" height={14} width={14} />
          </div>
          <TextLineCamp className="text-base">{title}</TextLineCamp>
        </div>
        <div className="flex items-center px-2 justify-end gap-2">
          {activities?.map((e, idx) => {
            const isCurrent = e.id === activityId;
            return (
              <Tooltip key={e.id} label={t(e.title)}>
                <a
                  className={clsx(
                    "border border-transparent text-white h-[28px] min-w-[28px] px-2 rounded-[6px] text-sm flex items-center justify-center",
                    {
                      "!bg-navy-primary font-semibold": isCurrent,
                      "bg-[#19395E]": !isCurrent,
                    }
                  )}
                  onClick={(event) => {
                    event.preventDefault();
                    confirmAction({
                      message: t("Are you sure you want to move to another task?"),
                      onConfirm: () => {
                        router.push(`/learning/${permalink}?activityType=${e.activityType}&activityId=${e.id}`);
                      },
                    });
                  }}
                  href={`/learning/${permalink}?activityType=${e.activityType}&activityId=${e.id}`}
                >
                  {e.status === ActivityStatusEnum.COMPLETED ? <Check size={14} /> : e.idx}
                </a>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HeadQuiz;
