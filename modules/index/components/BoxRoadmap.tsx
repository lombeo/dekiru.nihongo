import React from "react";
import { useTranslation } from "next-i18next";
import Link from "@src/components/Link";
import { Container } from "@src/components";
import styles from "./../IndexView.module.scss";
import clsx from "clsx";
import { useRouter } from "next/router";

const BoxRoadmap = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale } = router;

  return (
    <div className="py-[70px]">
      <Container size="xl">
        <h2 className="text-[32px] lg:text-[42px] font-[700] leading-[1.26] text-center my-0">
          {t("Roadmap to become")} <br /> {t("a programmer")}
        </h2>
        <div
          className={clsx("mt-[80px] grid lg:grid-cols-3 gap-6", {
            "lg:!grid-cols-4": locale === "vi",
          })}
        >
          {[
            {
              content: t("Start learning with a wide range of basic to advanced courses created by top experts."),
              title: t("Learn to code"),
              link: `/learning`,
              image: "/images/index/hoc-lap-trinh.png",
            },
            {
              content: t("Level up your programming skills every day with our library of 1000+ challenges."),
              title: t("Practice coding"),
              link: `/training`,
              image: "/images/index/luyen-lap-trinh.png",
            },
            {
              content: t("Participate in contests to test the geek in you and improve your coding skills."),
              title: t("Join coding contest"),
              link: `/fights`,
              image: "/images/index/thi-lap-trinh.png",
            },
            {
              content: "Tìm hiểu kiến thức lập trình thông qua chia sẻ từ các chuyên gia.",
              title: "Tìm hiểu lập trình",
              link: `/sharing`,
              image: "/images/index/chia-se-lap-trinh.png",
              hidden: locale !== "vi",
            },
          ]
            .filter((e) => !e.hidden)
            .map((item, index) => (
              <RoadmapItem data={item} index={index} key={item.link} />
            ))}
        </div>
      </Container>
    </div>
  );
};

export default BoxRoadmap;

const RoadmapItem = (props: any) => {
  const { data, index } = props;
  return (
    <Link className={clsx(styles.RoadmapItem, "max-w-[calc(100%_-_60px)] mx-auto")} href={data.link}>
      <div className="relative wrapImage rounded-[10px] shadow-[0_0_20px_0_rgba(29,31,89,.1)] bg-white text-center">
        <img src={data.image} alt="" className="max-w-full" />
        <div className="rounded-full w-[40px] h-[40px] flex items-center justify-center text-white text-lg -translate-x-1/2 -translate-y-1/2 absolute top-0 left-0 z-10 bg-[linear-gradient(90deg,#2c31cf_0%,#b44fff_100%)]">
          {index + 1}
        </div>
      </div>
      <h3 className="hover:text-[#2c31cf] text-[26px] mt-[40px] mb-0 text-center leading-[1.27] font-[700]">
        {data.title}
      </h3>
      <div className="text-lg mt-[10px] mb-0 font-[500] text-center">{data.content}</div>
    </Link>
  );
};
