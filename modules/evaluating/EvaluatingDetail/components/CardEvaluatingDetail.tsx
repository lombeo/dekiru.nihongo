import { Card, Image, Progress, Text, clsx } from "@mantine/core";
import { DifficultEnum, EvaluateStatusEnum, ProgressActivityStatus } from "@src/constants/evaluate/evaluate.constant";
import UserRole from "@src/constants/roles";
import { useHasAnyRole } from "@src/helpers/helper";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
const listBg = [
  "/images/evaluating/test-center-test-bg.png",
  "/images/evaluating/test-center-test-bg-2.png",
  "/images/evaluating/test-center-test-bg-3.png",
  "/images/evaluating/test-center-test-bg-4.png",
  "/images/evaluating/test-center-test-bg-5.png",
  "/images/evaluating/test-center-test-bg-6.png",
];

const CardEvaluatingDetail = (props: any) => {
  const { data, index, dataT, token, firstIndex, isCreate } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const isAdmin = useHasAnyRole([UserRole.ManagerContent, UserRole.TestCenter]);
  const notTargetAct = () => {
    if (
      dataT.status === EvaluateStatusEnum.Waiting ||
      dataT.status === EvaluateStatusEnum.Finished ||
      dataT.status === EvaluateStatusEnum.Expired
    ) {
      if ((isCreate && !dataT.anonymousUserName) || isAdmin) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const getColor = () => {
    const rate = data?.pointsScored / data?.point;
    if (rate >= 0.5) {
      if (rate >= 0.8) {
        return "green";
      }
      return "orange";
    } else {
      return "red";
    }
  };

  const getColorActivity = (difficult: any, invisible: any, status: any, isCorrect: any, token: any) => {
    if (status === ProgressActivityStatus.Finished) {
      if (invisible || !token) {
        if (difficult === DifficultEnum.Easy) {
          return "border-green-500 text-white bg-green-500";
        } else if (difficult === DifficultEnum.Medium) {
          return "border-orange-500 text-white bg-orange-500";
        } else if (difficult === DifficultEnum.Hard) {
          return "border-red-500 text-white bg-red-500";
        }
      } else {
        if (isCorrect) {
          if (difficult === DifficultEnum.Easy) {
            return "border-green-500 text-white bg-green-500";
          } else if (difficult === DifficultEnum.Medium) {
            return "border-orange-500 text-white bg-orange-500";
          } else if (difficult === DifficultEnum.Hard) {
            return "border-red-500 text-white bg-red-500";
          }
        } else {
          if (difficult === DifficultEnum.Easy) {
            return "border-green-500 text-green-500 border-dashed";
          } else if (difficult === DifficultEnum.Medium) {
            return "border-orange-500 text-orange-500 border-dashed";
          } else if (difficult === DifficultEnum.Hard) {
            return "border-red-500 text-red-500 border-dashed";
          }
        }
      }
    } else {
      if (difficult === DifficultEnum.Easy) {
        return "border-green-500 text-green-500 hover:bg-green-500 hover:text-white";
      } else if (difficult === DifficultEnum.Medium) {
        return "border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white";
      } else if (difficult === DifficultEnum.Hard) {
        return "border-red-500 text-red-500 hover:bg-red-500 hover:text-white";
      }
    }
  };
  return (
    <Card>
      <div className="relative max-w-[605px] flex flex-col overflow-hidden border h-full rounded-t-sm shadow-sm">
        <Image width={605} height={140} radius="sm" src={listBg[index % 6]} />
        <div className="w-[120px] h-[110px] absolute translate-x-[-50%] translate-y-[-50%] top-0 left-0 shadow-md rounded-[35px] bg-[#f26c6c]" />
        <Text className="text-white px-2 py-3 absolute top-0 left-0">{`${data?.percent}%`}</Text>
        <div className="  absolute top-[50px] left-0 right-0  flex items-center justify-center">
          <Text className="text-xl bg-white p-3 rounded-3xl font-semibold text-center">{data?.name}</Text>
        </div>
        <div className="flex flex-col justify-between h-[100%]">
          <div className="flex gap-2 justify-center py-6 flex-wrap">
            {data?.listActivities.map((activity, index1) => {
              return (
                <div
                  key={activity.activityId}
                  onClick={() =>
                    notTargetAct() ||
                    router.push(
                      `/evaluating/detail/${dataT.id}/${activity.activityId}?activityType=${activity.activityType}${
                        token ? "&token=" + token : ""
                      }`
                    )
                  }
                  className={clsx(
                    getColorActivity(
                      activity.levelId,
                      dataT?.isInvisibleResult,
                      activity.status,
                      activity.pointScored == activity.point,
                      token
                    ),
                    `w-[35px] h-[35px] rounded-full border flex justify-center items-center ${
                      notTargetAct() ? "cursor-not-allowed" : "cursor-pointer"
                    }`
                  )}
                >
                  {index1 + firstIndex}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center px-4 py-2">
            <div className="w-[75%]">
              <Progress color={getColor()} value={(data?.pointsScored / data?.point) * 100 ?? 0} />
            </div>
            <div className="flex gap-1 items-center">
              <Text className="text-blue-500">
                {data?.pointsScored}/{data?.point}
              </Text>
              <Text>{t("score")}</Text>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CardEvaluatingDetail;
