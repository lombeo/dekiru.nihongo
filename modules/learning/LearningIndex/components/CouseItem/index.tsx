import { TextLineCamp } from "@edn/components/TextLineCamp";
import Icon from "@edn/font-icons/icon";
import { HoverCard, Image, Progress, Text } from "@mantine/core";
import { Notify } from "@src/components/cms";
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

export type CourseItemProps = any;

const CourseItem: React.FC<{ data: CourseItemProps; refetch: any }> = ({ data, refetch }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoadingEnroll, setIsLoadingEnroll] = useState<boolean>(false);
  const numberFormat = new Intl.NumberFormat();

  const rating = { averageRating: data?.averageRate || 0 };
  const linkStudyNow = `/learning-detail/${data.id}`;

  const priceAfterDiscount = data?.price;

  const priceElement =
    data.price > 0 ? (
      <div className="flex gap-[6px] text-sm items-center justify-between">
        <div className="font-semibold text-lg text-[#F56060] inline-flex w-fit">
          {data.percentOff > 0 ? numberFormat.format(priceAfterDiscount) : numberFormat.format(data.price + (data?.price*(data?.percentOff*1/100)))}
          &nbsp;đ
        </div>
        {data.percentOff > 0 && (
          <div className="flex flex-row items-center gap-[6px]">
            <Text className="line-through font-medium text-sm text-[#637381]">
              {numberFormat.format(data.price + (data?.price*(data?.percentOff*1/100)))}&nbsp;đ
            </Text>
            <div className="bg-[#FEEBEB] rounded-sm p-[2px]">
              <Text className="text-xs font-medium text-[#F56060]">-{data?.percentOff}%</Text>
            </div>
          </div>
        )}
      </div>
    ) : null;

  const tags = [
    {
      label: 32+" tiếng",//`${data?.estimateTimeComplete || 0} ${t(data?.estimateTimeComplete === 1 ? "hour" : "hours")}`,
    },
    {
      label: 16+" bài học",//`${data?.totalActivity} ${t(data?.totalActivity === 1 ? "lesson" : "lessons")}`,
    }
  ];

  // const handleEnrollNow = () => {
  //   setIsLoadingEnroll(true);
  //   let model = {
  //     courseId: data.id,
  //   };
  //   LearnCourseService.enrollCourse(model).then((response: any) => {
  //     if (response.data && response.data?.success) {
  //       const orderId = response.data.data.orderId;
  //       if (orderId) router.push(`/payment/orders/checkout?orderId=${orderId}&contextType=${CommentContextType.Course}`);
  //       else {
  //         Notify.success(t("Enroll this course successfully!"));
  //       }
  //     } else {
  //       if (response.data?.message && response.data?.message != "") {
  //         Notify.error(t(response.data?.message));
  //       } else {
  //         Notify.error(t("Enroll failed!"));
  //       }
  //     }
  //     refetch();
  //     setIsLoadingEnroll(false);
  //   });
  // };

  // const addItemCart = useAddItemCart();

  // const handleAddToCart = async () => {
  //   const success = await addItemCart({
  //     contextId: data.id,
  //     thumbnail: data.thumbnail,
  //     title: data.title,
  //     contextType: CommentContextType.Course,
  //     link: `/learning/${data.permalink}`,
  //     count: 1,
  //     price: data.price,
  //     discount: data.price - priceAfterDiscount,
  //   });
  //   if (success) {
  //     setOpenModalAddedToCart(true);
  //   }
  // };

  return (
    <>
      <div className="col-span-12 sm:col-span-6 md:col-span-4 gmd:col-span-3">
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
                  <div className="flex-1">
                    {/* {data.isCombo ? (
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
                    ) : ( */}
                      <Image
                        src={data?.courseImage}
                        alt="course-thumbnail"
                        height={170}
                        width="100%"
                        fit="fill"
                        className="w-full"
                      />
                      <div className="absolute top-[10px] right-5 bg-[#111928] w-8 h-8 flex justify-center items-center rounded-lg bg-opacity-50">
                        <Flame size={20} />
                      </div>

                    <div className="px-4 pt-4 gap-4 flex flex-col justify-between h-[calc(100%-170px)]">
                      <div className="flex flex-col gap-0.5 items-start">
                        <div className="flex flex-row gap-2 font-[500]">
                          <div className="bg-[#DCE1FC] px-[6px] rounded-sm h-5 flex items-center justify-center">
                            <span className="text-xs font-medium text-[#506CF0]">
                              {t("Course")}
                            </span>
                          </div>
                          {/* {data?.isNew && ( */}
                            <div className="bg-[#DAF8E6] px-[6px] rounded-sm h-5 flex items-center justify-center">
                              <span className="text-xs font-medium text-[#06A09B]">{t("Newest")}</span>
                            </div>
                          {/* )} */}
                          {/* {data?.isPopular && (
                            <div className="bg-[#FEEBEB] px-[6px] rounded-sm h-5 flex items-center justify-center">
                              <span className="text-xs font-medium text-[#F56060]">{t("Popular")}</span>
                            </div>
                          )}
                          {data?.isBest && (
                            <div className="bg-[#FEEBEB] px-[6px] rounded-sm h-5 flex items-center justify-center">
                              <span className="text-xs font-medium text-[#F56060]">{t("Favorite")}</span>
                            </div>
                          )} */}
                        </div>
                        <TextLineCamp line={2} className="mt-1">
                          <h1 className="m-0 font-semibold text-base leading-[26px]">{data?.courseName}</h1>
                        </TextLineCamp>
                        <Link
                          className="max-w-[100px] w-fit text-[#637381] hover:underline"
                        >
                          <TextLineCamp className="text-xs font-medium leading-[19.25px]">
                            Dekiru
                          </TextLineCamp>
                        </Link>
                        <div className="flex items-end gap-1 -mt-1">
                          <StarRatings rating={4.2} size="sm" />
                          <div className="text-[#111928] text-sm font-medium">4.2</div>
                        </div>
                      </div>
                      {data.price > 0 ? (
                        priceElement
                      ) : (
                        <span className="text-sm font-medium text-[#637381]">{t("Free")}</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    {/* {data.progress > 0 && ( */}
                      <Progress
                        classNames={{
                          bar: "bg-[#13C296]",
                          root: "bg-[#CED4DA]",
                        }}
                        size="4px"
                        radius="2px"
                        value={1}
                      />
                    {/* )} */}
                  </div>
                </div>
              </Link>
            </div>
          </HoverCard.Target>
          <HoverCard.Dropdown className="hidden p-8 rounded-xl border border-[#DFE4EA] md:flex flex-col gap-4 text-[#111928]">
            <div className="flex flex-col gap-1 items-start">
              <div className="bg-[#DCE1FC] px-[6px] rounded-sm h-5 flex items-center justify-center">
                <span className="text-xs font-medium text-[#506CF0]">{t("Course")}</span>
              </div>
              <span className="font-semibold text-2xl leading-[30px]">{data?.courseName}</span>
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
            <span className="font-normal text-sm leading-[22px]">{data?.subDescription}</span>
            <ul className="flex flex-col gap-4">
              {data?.whatYouWillLearn &&
                data?.whatYouWillLearn.map((obj, index) => (
                  <li key={`obj-${index}`} className="flex flex-row gap-[10px] items-start">
                    <Icon name="done" size={24} />
                    <span className="text-sm leading-[22px] font-normal">{obj}</span>
                  </li>
                ))}
            </ul>
            <div className="w-full flex flex-wrap gap-4 [&>button]:h-12">
              {/* {!data.isEnroll && ( */}
                <button
                  className="cursor-pointer flex-1 bg-[#506CF0] rounded-lg text-base leading-6 font-medium text-white flex justify-center items-center"
                  // onClick={handleEnrollNow}
                  disabled={isLoadingEnroll}
                >
                  {t(priceAfterDiscount > 0 ? "Buy now" : "Enroll for Free")}
                </button>
              {/* )} */}

              {/* {data.isEnroll && (
                <Link
                  href={linkStudyNow}
                  className="mt-auto mb-1 cursor-pointer rounded-[4px] w-full bg-[#13C296] text-base leading-6 font-medium text-white px-2 py-2 flex items-center justify-center"
                >
                  {t("Study now")}
                </Link>
              )} */}
            </div>
          </HoverCard.Dropdown>
        </HoverCard>
      </div>
      {/* {openModalAddedToCart && (
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
      )} */}
    </>
  );
};

export default CourseItem;
