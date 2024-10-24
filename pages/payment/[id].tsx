import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LearnCourseService } from "@src/services";
import HeadSEO from "@src/components/SEO/HeadSEO";
import DefaultLayout from "@src/components/Layout/Layout";
import { useQuery } from "@tanstack/react-query";
import BoxBanner from "@src/modules/course-detail/components/BoxBanner";
import { Container } from "@src/components";
import BoxIntroduce from "@src/modules/course-detail/components/BoxIntroduce";
import { clsx, Image } from "@mantine/core";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Breadcrumbs, Button } from "@edn/components";
import StarRatings from "@src/components/StarRatings";
import { DesktopCode, WatchCircleTime } from "@src/components/Svgr/components";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { ExternalService } from "@src/services/ExternalService";

const Payment = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: course } = useQuery({
    queryKey: ["courseDetail", id], // Key cho query
    queryFn: () => LearnCourseService.getCourseDetail({ courseId: id }), // Hàm gọi API
    enabled: !!id, // Chỉ gọi API khi id có giá trị
  });

  const { data: getQr } = useQuery({
    queryKey: ["getQrCode", id], // Key cho query
    queryFn: () => ExternalService.getQr(id), // Hàm gọi API
    enabled: !!id, // Chỉ gọi API khi id có giá trị
  });

  return (
    <>
      <HeadSEO
        title={course?.data?.courseName}
        description={course?.data?.subDescription}
        ogImage={course?.data?.imageUrl}
      />
      <DefaultLayout bgGray allowAnonymous>
        <div className="pb-20">
          <Container size="custom">
            <Breadcrumbs
              data={[
                {
                  title: "Trang chủ",
                  href: "/home",
                },
                {
                  title: course?.data?.courseName,
                },
                {
                  title: "Thanh toán",
                },
              ]}
            />
            <div className="grid gap-8 lg:grid-cols-[1fr_380px] items-start">
              <div className="bg-white shadow-[0_5px_12px_0_#0000001A] rounded-md overflow-hidden flex flex-wrap sm:grid grid-cols-[auto_1fr] gap-4">
                <div className="w-[320px] hover:opacity-80 p-2">
                  <Image
                    src={course?.data?.courseImage}
                    withPlaceholder
                    height={176}
                    width={320}
                    fit="fill"
                    alt="thumbnail"
                  />
                </div>
                <div className="flex gap-6 justify-between p-4">
                  <div className="flex flex-col gap-1">
                    <div className="hover:underline hover:text-navy-primary">
                      <TextLineCamp
                        data-tooltip-id="global-tooltip"
                        data-tooltip-place="top"
                        data-tooltip-content={course?.data?.courseName}
                        className="w-fit text-lg font-semibold"
                        line={2}
                      ></TextLineCamp>
                    </div>
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-1 flex-none text-xs">
                        <StarRatings rating={4.2} size="sm" /> <span>{4.2}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-none text-xs">
                        <WatchCircleTime width={12} height={12} />
                        <span>số giờ học: {(course?.data?.duration / 60).toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-none text-xs">
                        <DesktopCode width={12} height={12} />
                        <span>số bài giảng: {course?.data?.numberContent}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <div className="font-semibold text-lg">{FunctionBase.formatPrice(course?.data?.price)}</div>
                      {course?.data?.percentOff > 0 && (
                        <div className="flex flex-row items-center gap-2">
                          <div className="line-through text-gray-primary text-sm">
                            {FunctionBase.formatPrice(
                              course?.data.price + course?.data?.price * ((course?.data?.percentOff * 1) / 100)
                            )}
                          </div>
                        </div>
                      )}
                      <div
                        className={clsx("lg:ml-0 w-[92px]", {
                          "ml-[26px]": true,
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-6 bg-white rounded-md shadow-[0_5px_12px_0_#0000001A] pb-14 relative">
                <div className="space-y-4">
                  <h2 className="my-0 font-semibold text-lg">Phương thức thanh toán</h2>
                  <img src={getQr?.data.data} alt="QR Code" className="w-full h-auto object-contain" />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="text-lg font-semibold">Tổng</div>
                  <div className="flex items-center justify-between">
                    <div className="text-gray-primary">Tổng</div>
                    <div className="font-semibold">{FunctionBase.formatPrice(course?.data?.price)}</div>
                  </div>
                </div>
                <Button
                  //   disabled={amountInfo.totalAmount <= 0 || !currentMethod || loading}
                  //   onClick={handlePayment}
                  color={"blue"}
                  className="w-full"
                  size="lg"
                  radius="md"
                >
                  Thanh toán
                </Button>
                <div className="absolute h-[48px] bg-cover bg-bottom bottom-[-12px] left-0 right-0 bg-[url('/images/payment/subtract.png')]" />
              </div>
            </div>
          </Container>
        </div>
      </DefaultLayout>
    </>
  );
};

export default Payment;
