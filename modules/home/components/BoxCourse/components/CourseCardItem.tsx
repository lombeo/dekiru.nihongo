import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import Icon from "@edn/font-icons/icon";
import { clsx, HoverCard, Image, Progress, Text } from "@mantine/core";
import Link from "@src/components/Link";
import StarRatings from "@src/components/StarRatings";
import { Flame } from "@src/components/Svgr/components";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { getCurrentLang } from "@src/helpers/helper";
import useAddItemCart from "@src/hooks/useCart/useAddItemCart";
import ModalAddedCourseToCart from "@src/modules/course-detail/components/ModalAddedCourseToCart";
import { LearnCourseService } from "@src/services";
import { CommentContextType } from "@src/services/CommentService/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";

interface CourseCardItemProps {
  data: any;
}

const CourseCardItem = (props: CourseCardItemProps) => {
  const { data } = props;

  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;

  const [isLoadingEnroll, setIsLoadingEnroll] = useState<boolean>(false);
  const [openModalAddedToCart, setOpenModalAddedToCart] = useState<boolean>(false);

  const numberFormat = new Intl.NumberFormat();

  const rating = { averageRating: data?.averageRate || 0 };

  const multiLangData = getCurrentLang(data, locale, "multiLangData") || data.multiLangData?.[0];
  const linkStudyNow = data.permalink ? `/learning/${data.permalink}` : `/learning/${multiLangData?.permalink}`;

  const priceAfterDiscount = data?.priceAfterDiscount;

  const priceElement =
    data.price > 0 ? (
      <div className="flex gap-[6px] text-sm items-center justify-between">
        <div className="font-semibold text-lg text-[#F56060] inline-flex w-fit">
          {data.discount > 0 ? numberFormat.format(priceAfterDiscount) : numberFormat.format(data.price)}
          &nbsp;đ
        </div>
        {data.discount > 0 && (
          <div className="flex flex-row items-center gap-[6px]">
            <Text className="line-through font-medium text-sm text-[#637381]">
              {numberFormat.format(data.price)}&nbsp;đ
            </Text>
            <div className="bg-[#FEEBEB] rounded-sm p-[2px]">
              <Text className="text-xs font-medium text-[#F56060]">-{data?.discount}%</Text>
            </div>
          </div>
        )}
      </div>
    ) : null;

  const tags = [
    {
      label: `${data?.estimateTimeComplete || 0} ${t(data?.estimateTimeComplete === 1 ? "hour" : "hours")}`,
    },
    {
      label: `${data?.totalActivity} ${t(data?.totalActivity === 1 ? "lesson" : "lessons")}`,
    },
    {
      label: `${FunctionBase.formatNumber(data?.totalEnroll || 0)} ${t(
        data?.totalEnroll === 1 ? "learner" : "learners"
      )}`,
    },
  ];

  const handleEnrollNow = () => {
    setIsLoadingEnroll(true);
    let model = {
      courseId: data.id,
    };
    LearnCourseService.enrollCourse(model).then((response: any) => {
      if (response.data && response.data?.success) {
        const orderId = response.data.data.orderId;
        if (orderId) router.push(`/payment/orders/checkout?orderId=${orderId}&contextType=${CommentContextType.Course}`);
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
      // refetch();
      setIsLoadingEnroll(false);
    });
  };

  const addItemCart = useAddItemCart();

  const handleAddToCart = async () => {
    const success = await addItemCart({
      contextId: data.id,
      thumbnail: data.thumbnail,
      title: data.title,
      contextType: CommentContextType.Course,
      link: `/learning/${data.permalink}`,
      count: 1,
      price: data.price,
      discount: data.price - priceAfterDiscount,
    });
    if (success) {
      setOpenModalAddedToCart(true);
    }
  };

  return (
    <>
      <div className="col-span-12 sm:col-span-6 md:col-span-4 gmd:col-span-3 h-full py-3 px-1">
        <HoverCard
          zIndex={180}
          withinPortal
          width={350}
          offset={12}
          arrowSize={16}
          withArrow
          position="left"
          shadow="lg"
          transitionProps={{ transition: "pop" }}
          classNames={{ arrow: "-z-10" }}
          openDelay={400}
        >
          <HoverCard.Target>
            <div className="h-full shadow-[0px_5px_12px_0px_#0000001A] rounded-md bg-white overflow-hidden">
              <Link href={linkStudyNow} className="h-full">
                <div className="h-full flex flex-col justify-between relative">
                  <div>
                    {data.isCombo ? (
                      <div className="h-[170px]">
                        <svg width="100%" height={199} viewBox="0 0 280 164">
                          <path
                            fill="url(#a412512)"
                            d="M0 134.035V5.5C0 2.73858 2.23857 0.5 5 0.5H275C277.761 0.5 280 2.73858 280 5.5V135.18C280 137.192 278.794 139.008 276.941 139.788L221.841 162.993C221.051 163.325 220.189 163.449 219.337 163.353L4.43706 139.003C1.90963 138.716 0 136.578 0 134.035Z"
                          />
                          <defs>
                            <pattern id="a412512" height="100%" width="100%" patternContentUnits="objectBoundingBox">
                              <image height="1" width="1" preserveAspectRatio="none" xlinkHref={data.thumbnail} />
                            </pattern>
                          </defs>
                        </svg>
                      </div>
                    ) : (
                      <Image
                        src={data?.thumbnail}
                        alt="course-thumbnail"
                        withPlaceholder
                        fit="fill"
                        classNames={{ image: "aspect-[288/170]" }}
                        className="w-full aspect-[288/170]"
                      />
                    )}
                    {data?.isHot && (
                      <div className="absolute top-[10px] right-5 bg-[#111928] w-8 h-8 flex justify-center items-center rounded-lg bg-opacity-50">
                        <Flame size={20} />
                      </div>
                    )}

                    <div
                      className={clsx("px-4 pt-4 gap-4 flex flex-col justify-between", {
                        "h-[180px]": !data.isCombo,
                        "h-[208px]": data.isCombo,
                      })}
                    >
                      <div className="flex-1 flex flex-col gap-0.5 items-start">
                        <div className="flex flex-row gap-2 font-[500]">
                          <div className="bg-[#DCE1FC] px-[6px] rounded-sm h-5 flex items-center justify-center">
                            <span className="text-xs font-medium text-[#506CF0]">
                              {data?.isCombo ? "Combo" : t("Course")}
                            </span>
                          </div>
                          {data?.isNew && (
                            <div className="bg-[#DAF8E6] px-[6px] rounded-sm h-5 flex items-center justify-center">
                              <span className="text-xs font-medium text-[#06A09B]">{t("Newest")}</span>
                            </div>
                          )}
                          {data?.isPopular && (
                            <div className="bg-[#FEEBEB] px-[6px] rounded-sm h-5 flex items-center justify-center">
                              <span className="text-xs font-medium text-[#F56060]">{t("Popular")}</span>
                            </div>
                          )}
                          {data?.isBest && (
                            <div className="bg-[#FEEBEB] px-[6px] rounded-sm h-5 flex items-center justify-center">
                              <span className="text-xs font-medium text-[#F56060]">{t("Favorite")}</span>
                            </div>
                          )}
                        </div>

                        <TextLineCamp line={2} className="mt-1">
                          <h1 className="m-0 font-semibold text-base leading-[26px]">{data?.title}</h1>
                        </TextLineCamp>

                        <Link
                          href={`/profile/${data.owner?.userId}`}
                          className="max-w-[100px] w-fit text-[#637381] hover:underline"
                        >
                          <TextLineCamp className="text-xs font-medium leading-[19.25px]">
                            {data.owner?.userName}
                          </TextLineCamp>
                        </Link>
                        <div className="flex items-end gap-1 -mt-1">
                          <StarRatings rating={data.averageRate} size="sm" />
                          <div className="text-[#111928] text-sm font-medium">{data.averageRate?.toFixed(1)}</div>
                        </div>
                      </div>
                      <div>
                        {data.price > 0 ? (
                          priceElement
                        ) : (
                          <span className="text-sm font-medium text-[#637381]">{t("Free")}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    {data.progress > 0 && (
                      <Progress
                        classNames={{
                          bar: "bg-[#13C296]",
                          root: "bg-[#CED4DA]",
                        }}
                        size="4px"
                        radius="2px"
                        value={data.progress}
                      />
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </HoverCard.Target>
          <HoverCard.Dropdown className="hidden p-8 rounded-xl border border-[#DFE4EA] md:flex flex-col gap-4 text-[#111928]">
            <div className="flex flex-col gap-1 items-start">
              <div className="bg-[#DCE1FC] px-[6px] rounded-sm h-5 flex items-center justify-center">
                <span className="text-xs font-medium text-[#506CF0]">{data?.isCombo ? "Combo" : t("Course")}</span>
              </div>
              <span className="font-semibold text-2xl leading-[30px]">{data?.title}</span>
              <div className="flex items-center gap-2">
                {tags.map((tag, index) => (
                  <>
                    <div key={`course-tag${tag.label}`} className="text-xs font-normal text-[#637381] leading-5">
                      {tag.label}
                    </div>
                    {index < tags.length - 1 && <div className="w-[2px] h-[2px] rounded-full bg-[#637381]" />}
                  </>
                ))}
              </div>
            </div>
            <div className="overflow-auto max-h-[200px]">
              <span className="font-normal text-sm leading-[22px]">{data?.summary}</span>
              <ul className="flex flex-col gap-4 overflow-auto">
                {data?.objectives &&
                  data?.objectives.map((obj, index) => (
                    <li key={`obj-${index}`} className="flex flex-row gap-[10px] items-start">
                      <Icon name="done" size={24} />
                      <span className="text-sm leading-[22px] font-normal">{obj}</span>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="w-full flex flex-wrap gap-4 [&>button]:h-12">
              {priceAfterDiscount > 0 && !data?.isEnroll && (
                <button
                  className="cursor-pointer bg-[#111928] rounded-lg px-4 text-base leading-6 font-medium text-white flex justify-center items-center"
                  onClick={handleAddToCart}
                >
                  {t("Add to cart")}
                </button>
              )}
              {!data.isEnroll && (
                <button
                  className="cursor-pointer flex-1 bg-[#506CF0] rounded-lg text-base leading-6 font-medium text-white flex justify-center items-center"
                  onClick={handleEnrollNow}
                  disabled={isLoadingEnroll}
                >
                  {t(priceAfterDiscount > 0 ? "Buy now" : "Enroll for Free")}
                </button>
              )}

              {data.isEnroll && (
                <Link
                  href={linkStudyNow}
                  className="mt-auto mb-1 cursor-pointer rounded-[4px] w-full bg-[#13C296] text-base leading-6 font-medium text-white px-2 py-2 flex items-center justify-center"
                >
                  {t("Study now")}
                </Link>
              )}
            </div>
          </HoverCard.Dropdown>
        </HoverCard>
      </div>
      {openModalAddedToCart && (
        <ModalAddedCourseToCart
          onClose={() => setOpenModalAddedToCart(false)}
          thumbnail={data?.thumbnail}
          title={data?.title}
          owner={data?.owner?.userName}
          rating={rating}
          duration={data?.estimateTimeComplete}
          totalStudent={data?.totalEnroll}
          price={data?.price}
          discount={data?.discount}
          actualPrice={data?.priceAfterDiscount}
        />
      )}
    </>
  );
};

export default CourseCardItem;
