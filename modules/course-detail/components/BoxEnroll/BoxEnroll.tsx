import { Notify } from "@edn/components/Notify/AppNotification";
import { Button } from "@mantine/core";
import { ActivityStatusEnum } from "@src/constants/activity/activity.constant";
import { useProfileContext } from "@src/context/Can";
import { validateUsername } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage } from "@src/helpers/helper";
import { CommentContextType } from "@src/services/CommentService/types";
import { LearnCourseService } from "@src/services/LearnCourseService";
import { setOpenModalChangeUsername, setOpenModalLogin } from "@src/store/slices/applicationSlice";
import clsx from "clsx";
import Link from "components/Link";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { ArrowRight } from "tabler-icons-react";
import { CourseDetailContext } from "../../context/CourseDetailContext";
import ModalAddedCourseToCart from "../ModalAddedCourseToCart";
import ModalActivation from "./components/ModalActivation";
import ModalOptionsBuy from "./components/ModalOptionsBuy";

interface BoxEnrollProps {
  data: any;
  refreshData: () => void;
  isCourseManager: boolean;
  isSmall?: boolean;
  rating?: any;
}

const BoxEnroll = (props: BoxEnrollProps) => {
  const { data, isSmall, refreshData, rating } = props;

  const { allowPreviewCourseList } = useContext(CourseDetailContext);

  const { t } = useTranslation();

  const router = useRouter();
  const { locale } = router;
  const { permalink } = router.query;

  const { profile } = useProfileContext();

  const dispatch = useDispatch();

  const [openModalAddedToCart, setOpenModalAddedToCart] = useState(false);
  const [openModalBuyCode, setOpenModalBuyCode] = useState(false);

  const isEnroll = data?.isEnroll;
  const isPaidCourse = data?.price > 0;
  const isPending = data?.enrollStatus == 0;
  const priceAfterDiscount = data?.price ? data.price * (100 - (data.discount || 0)) * 0.01 : 0;

  const isInEnrollTime = (() => {
    const ENDLESS = 8.64e15;
    const present = moment(moment().format("YYYY-MM-DD"));
    const startDate = data?.startTime ? moment(moment(data.startTime).format("YYYY-MM-DD")) : present;
    const endDate = data?.endTime ? moment(moment(data.endTime).format("YYYY-MM-DD")) : moment(ENDLESS);
    return startDate <= present && present <= endDate;
  })();

  const [isLoadingEnroll, setIsLoadingEnroll] = useState(false);
  const [openModalOptionsBuy, setOpenModalOptionsBuy] = useState(false);
  const [openModalActivation, setOpenModalActivation] = useState(false);

  const firstActivity = data?.courseSchedule?.courseScheduleList?.[0]?.sections?.[0]?.activities?.[0];
  const sections = data?.courseSchedule?.courseScheduleList?.flatMap((e) => e.sections || []) || [];
  const activities = sections.flatMap((e) => e.activities || []);
  const activityLastInprogress = activities.filter((e) => e.activityStatus !== ActivityStatusEnum.COMPLETED);
  const activity = activityLastInprogress?.[0] || firstActivity;

  let linkStudyNow = `/learning/${permalink}?activityId=${activity?.activityId}&activityType=${activity?.activityType}`;

  const firstSubCourse = data?.subCourses?.[0];
  if (data?.isCombo && firstSubCourse) {
    const multiLangData = resolveLanguage(firstSubCourse, locale);
    linkStudyNow = `/learning/${multiLangData?.permalink || firstSubCourse?.permalink}`;
  }

  const handleClickEnrollNow = () => {
    if (profile && profile.userName && validateUsername(profile.userName)) {
      dispatch(setOpenModalChangeUsername(true));
      return;
    }
    handleEnrollNow();
  };

  const handleEnrollNow = () => {
    setIsLoadingEnroll(true);
    let model = {
      courseId: data.id,
    };
    LearnCourseService.enrollCourse(model).then((response: any) => {
      if (response.data && response.data?.success) {
        const orderId = response.data.data.orderId;
        if (orderId)
          router.push(`/payment/orders/checkout?orderId=${orderId}&contextType=${CommentContextType.Course}`);
        else {
          Notify.success(t("Enroll this course successfully!"));
        }
      } else {
        if (response.data?.message && response.data?.message != "") {
          Notify.error(t(response.data?.message));
        } else {
          Notify.error(t("Enroll failed!"));
        }
      }
      refreshData();
      setIsLoadingEnroll(false);
    });
  };

  const handleDonate = () => {
    setOpenModalOptionsBuy(true);
    setOpenModalBuyCode(true);
  };

  const handleRedirectToFirstAllowPreviewSection = () => {
    router.push(
      `/learning/${permalink}?activityType=${allowPreviewCourseList[0]?.activityType}&activityId=${allowPreviewCourseList[0]?.activityId}`
    );
  };

  if (!data) {
    return <div className="h-[50px]" />;
  }

  return (
    <>
      {openModalOptionsBuy && (
        <ModalOptionsBuy
          data={data}
          priceAfterDiscount={priceAfterDiscount}
          onClose={() => {
            setOpenModalOptionsBuy(false);
            setOpenModalBuyCode(false);
          }}
          onBuyNow={() => {
            setOpenModalOptionsBuy(false);
            setOpenModalBuyCode(false);
            handleEnrollNow();
          }}
          onAddedToCart={() => {
            setOpenModalOptionsBuy(false);
            setOpenModalBuyCode(false);
            setOpenModalAddedToCart(true);
          }}
          isBuyCode={openModalBuyCode}
        />
      )}
      {openModalActivation && (
        <ModalActivation
          data={data}
          onClose={() => setOpenModalActivation(false)}
          onSuccess={() => {
            refreshData();
            setOpenModalActivation(false);
          }}
        />
      )}
      {openModalAddedToCart && (
        <ModalAddedCourseToCart
          onClose={() => setOpenModalAddedToCart(false)}
          thumbnail={data?.thumbnail}
          title={data?.title}
          owner={data?.owner?.userName}
          rating={rating}
          duration={data?.duration}
          totalStudent={data?.totalStudent}
          price={data?.price}
          discount={data?.discount}
          actualPrice={data?.priceAfterDiscount}
        />
      )}
      {!profile && (
        <div className="flex flex-row gap-4">
          {allowPreviewCourseList.length > 0 && (
            <Button
              size="lg"
              classNames={{
                root: clsx("shadow-md px-4 bg-navy-primary text-base font-semibold text-white w-full max-w-[400px]", {
                  "w-fit": !isSmall,
                }),
              }}
              color="blue"
              disabled={isLoadingEnroll}
              radius="md"
              onClick={handleRedirectToFirstAllowPreviewSection}
            >
              {t("Try it out")}
            </Button>
          )}

          {isPaidCourse ? (
            <>
              <Button
                size="lg"
                classNames={{
                  root: clsx(
                    "shadow-md px-4 bg-[#F56060] hover:bg-[#f05b5b] text-base font-semibold text-white w-full max-w-[400px]",
                    {
                      "w-fit": !isSmall,
                    }
                  ),
                }}
                color="blue"
                disabled={isLoadingEnroll}
                radius="md"
                onClick={() => setOpenModalOptionsBuy(true)}
              >
                {t("Buy now")}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                dispatch(setOpenModalLogin(true));
              }}
              radius="md"
              size="lg"
              className="shadow-md bg-yellow-300 hover:bg-yellow-500 w-full max-w-[400px]"
            >
              <div className="text-ink-primary text-center">
                <span className="text-base font-semibold"> {t("Please login to continue")}</span>
              </div>
            </Button>
          )}
        </div>
      )}

      {!!profile && (
        <>
          {isEnroll && isPending && (
            <Button
              radius="md"
              size="lg"
              className="bg-gray-500 w-full max-w-[400px] pointer-events-none px-2"
              color="gray"
            >
              <div className="text-center">
                <span className="text-base font-semibold">{t("Awaiting approval")}</span>
              </div>
            </Button>
          )}

          {isEnroll && !isPending && (
            <div
              className={clsx("flex gap-2.5", {
                "flex-col": isSmall,
              })}
            >
              <Link href={linkStudyNow}>
                <Button
                  radius="md"
                  size="lg"
                  rightIcon={<ArrowRight />}
                  className="bg-navy-primary px-4 w-full"
                  color="blue"
                >
                  <div className="text-center">
                    <span className="text-base font-semibold">{t("Study now")}</span>
                  </div>
                </Button>
              </Link>
              {isPaidCourse && (
                <Button
                  size="lg"
                  disabled={!isInEnrollTime || isLoadingEnroll}
                  classNames={{
                    root: clsx("shadow-md px-4 bg-[#13C296] text-white hover:bg-[#16b78c]"),
                    label: "flex flex-col items-center justify-center",
                  }}
                  color="green"
                  radius="md"
                  onClick={handleDonate}
                >
                  <div className="text-base font-semibold">{t("Buy code")}</div>
                </Button>
              )}
            </div>
          )}

          {(!isEnroll || isPending) && isPaidCourse && (
            <div
              className={clsx("flex gap-2.5", {
                "w-fit": !isSmall,
              })}
            >
              <Button
                size="lg"
                classNames={{
                  root: clsx(
                    "shadow-md px-4 bg-[#F56060] hover:bg-[#f05b5b] text-base font-semibold text-white w-full",
                    {
                      "text-sm": allowPreviewCourseList.length > 0,
                    }
                  ),
                }}
                color="blue"
                disabled={isLoadingEnroll}
                radius="md"
                onClick={() => setOpenModalOptionsBuy(true)}
              >
                {t("Buy now")}
              </Button>
              <Button
                size="lg"
                classNames={{
                  root: clsx(
                    "shadow-md px-4 bg-green-secondary hover:bg-[#16b78c] text-base font-semibold text-white w-full",
                    {
                      "text-sm": allowPreviewCourseList.length > 0,
                    }
                  ),
                }}
                color="green"
                disabled={isLoadingEnroll}
                radius="md"
                onClick={() => setOpenModalActivation(true)}
              >
                {t("Active")}
              </Button>
              {allowPreviewCourseList.length > 0 && (
                <Button
                  size="lg"
                  classNames={{
                    root: clsx("shadow-md px-4 bg-navy-primary text-sm font-semibold text-white w-full max-w-[400px]"),
                  }}
                  color="blue"
                  disabled={isLoadingEnroll}
                  radius="md"
                  onClick={handleRedirectToFirstAllowPreviewSection}
                >
                  {t("Try it out")}
                </Button>
              )}
            </div>
          )}

          {!isEnroll && !isPaidCourse && (
            <Button
              size="lg"
              disabled={!isInEnrollTime || isLoadingEnroll}
              classNames={{
                root: clsx(
                  "shadow-md px-4 bg-green-secondary hover:bg-[#16b78c] text-base font-semibold text-white hover:bg-[#16b78c]",
                  {
                    "w-fit": !isSmall,
                  }
                ),
              }}
              color="green"
              radius="md"
              onClick={() => handleClickEnrollNow()}
            >
              {t("Enroll for Free")}
            </Button>
          )}
        </>
      )}
    </>
  );
};

export default BoxEnroll;
