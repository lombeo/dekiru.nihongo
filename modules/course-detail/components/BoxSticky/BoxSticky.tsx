/* eslint-disable @next/next/no-img-element */
import { Progress } from "@mantine/core";
import { getStatisticActivities } from "@src/constants/courses/courses.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import BoxEnroll from "../BoxEnroll/BoxEnroll";
import styles from "./BoxSticky.module.scss";

interface BoxStickyProps {
  data: any;
  refreshData: () => void;
  isCourseManager: boolean;
}

const BoxSticky = (props: BoxStickyProps) => {
  const { data, isCourseManager, refreshData } = props;
  const { t } = useTranslation();

  const activities =
    data?.courseSchedule?.courseScheduleList?.flatMap((e) => e.sections?.flatMap((e1) => e1.activities)) || [];

  const statistic = getStatisticActivities(activities, t);

  // const tags = [
  // t("course_sticky.learning_hours", {
  //   count: data?.duration,
  // }),
  //   ...statistic.map((e) => e.label),
  //   t("course_sticky.lifetime_access"),
  //   t("course_sticky.certificate_completion", {
  //     percentage: data?.percentageToComplete || 90,
  //   }),
  // ];

  const tags = [
    {
      label: t("course_sticky.learning_hours", {
        count: data?.duration,
      }),
      icon: <img src="/images/learning/watch-circle-time.png" width={14} height={14} alt="watch-circle-time" />,
    },
    ...statistic.map((e) => {
      return { label: e.label, icon: e.icon };
    }),
    {
      label: t("course_sticky.lifetime_access"),
      icon: <img src="/images/learning/lifetime_access.png" width={14} height={14} alt="lifetime_access" />,
    },
    {
      label: t("course_sticky.certificate_completion", {
        percentage: data?.percentageToComplete || 90,
      }),
      icon: (
        <img src="/images/learning/certificate_completion.png" width={14} height={14} alt="certificate_completion" />
      ),
    },
  ];

  useEffect(() => {
    const listener = () => {
      const element = document.getElementById("box-sticky");
      const wrappedElement = document.getElementById("course-content");

      const tabElement = document.getElementById("tab-course-placeholder");

      if (!element || !wrappedElement) return;

      if (window.scrollY > wrappedElement.scrollHeight) {
        element.classList.add("stick-bottom");
        element.classList.remove("stick");
      } else if (window.scrollY > tabElement.offsetTop) {
        element.classList.add("stick");
        element.classList.remove("stick-bottom");
      } else {
        element.classList.remove("stick");
        element.classList.remove("stick-bottom");
      }
    };

    window.addEventListener("scroll", listener);
    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, []);

  const progress = Math.ceil(data?.progress || 0);

  const priceAfterDiscount = data?.priceAfterDiscount;

  return (
    <div id="box-sticky" className={styles["root"]}>
      <div className="p-5 bg-[#0E2643] text-white flex flex-col gap-5">
        <div>
          <h4 className="my-0 text-[24px] font-semibold">{t("This course includes")}:</h4>
          <ul className={styles.listItem}>
            {tags.map((item, index) => (
              <li key={index} className="list-none flex flex-row gap-[10px] items-center text-sm">
                {item.icon}
                <text>{item.label}</text>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          {data?.price > 0 && !data?.isEnroll && (
            <div>
              <div className="w-full h-px mb-4 bg-[#374151]"></div>
              <div className="font-semibold flex items-center gap-6">
                <div className="flex items-center gap-1 text-[28px]">
                  <span>{FunctionBase.formatNumber(priceAfterDiscount)}</span>
                  <span>đ</span>
                </div>
                {data?.discount > 0 && (
                  <div className="flex items-center gap-1 text-sm line-through">
                    <span>{FunctionBase.formatNumber(data.price)}</span>
                    <span>đ</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {data?.isEnroll && (
            <div>
              <div className="text-[#13C296] text-sm font-semibold">{progress}%</div>
              <Progress
                size="sm"
                color="green"
                classNames={{
                  bar: "bg-[#13C296]",
                  root: "bg-[#19395E] mt-1",
                }}
                value={progress}
              />
            </div>
          )}
          <BoxEnroll isSmall data={data} refreshData={refreshData} isCourseManager={isCourseManager} />
        </div>
      </div>
    </div>
  );
};

export default BoxSticky;
