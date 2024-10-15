import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Flex, Image, Title } from "@mantine/core";
import RawText from "@src/components/RawText/RawText";
import { MoneyEnum } from "@src/constants/courses/courses.constant";
import resolveBasePath from "@src/helpers/path-helper";
import clsx from "clsx";
import Link from "components/Link";
import DOMPurify from "isomorphic-dompurify";
import { isNil } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import styles from "./CourseCard.module.scss";

function CourseCard(props: { card: any; variant?: "normal" | "small" }) {
  const { t } = useTranslation();
  const { card = {}, variant } = props;
  const thumbnail = card.thumbnail;
  const permalink = card.permalink;
  const getPriceCourse = (price: number, moneyType: number) => {
    if (moneyType === MoneyEnum.USD) {
      return numberFormat.format(price * 25000);
    } else {
      return numberFormat.format(price);
    }
  };
  const { locale } = useRouter();
  const keyLocale = locale === "vi" ? "vn" : "en";
  const dataLocale = card.multiLangData?.find((e) => e.key === keyLocale);
  const title = dataLocale ? dataLocale.title : card.title;
  const summary = DOMPurify.sanitize(dataLocale ? dataLocale.summary : card.summary, {
    ALLOWED_TAGS: ["p"],
  });

  const CourseLink = (props: any) => {
    const urlCourseDetailOnline = `/learning/${permalink}`;
    return (
      <Link href={urlCourseDetailOnline}>
        <div className={props?.className}>{props.children}</div>
      </Link>
    );
  };

  if (variant == "small") {
    return (
      <article className={styles.small}>
        <CourseLink>
          <div className="flex items-center">
            <div className="w-1/3 h-28 bg-gray-200">
              <Image withPlaceholder src={thumbnail} fit="cover" height={112} />
            </div>
            <div className="w-2/3">
              {/* <div className={styles["type" + type]} /> */}
              <div className="px-4 py-2">
                <Title size={"h5"} className="hover:underline" weight="semibold">
                  <TextLineCamp line={2}>{title}</TextLineCamp>
                </Title>
                <span className="text-xs">{t("Personal")}</span>
              </div>
            </div>
          </div>
        </CourseLink>
      </article>
    );
  }

  const numberFormat = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });
  
  return (
    <article className={styles.card}>
      <CourseLink>
        <div
          className={styles.head}
          style={{
            backgroundImage: `url("${resolveBasePath("/empty.png")}")`,
          }}
        >
          {thumbnail && <Image src={thumbnail} alt={permalink} fit="fill" height="11rem" />}
        </div>
        <div className={styles.body}>
          <div className={styles["type"]} />
          <div className={styles.content}>
            {/* <div className="flex gap-2 justify-between mt-[-5px]">
              <div className={styles.rateWrap}>
                <NoSSR>
                  <StarRatings rating={0} starDimension="1rem" starRatedColor="rgba(238, 90, 0, 1)" numberOfStars={5} />
                </NoSSR>
              </div>
              <div className={styles.online}>Online</div>
            </div> */}
            <Title size={"h4"} className="hover:opacity-80 font-semibold mt-2 mb-2" weight="normal">
              {title}
            </Title>
            <TextLineCamp line={2}>
              <RawText className="text-[15px]" content={summary} />
            </TextLineCamp>
            <Flex align="center" className="justify-between">
              <div className={clsx("text-[#4c5eff] font-semibold border-[#dcdff1] border-t w-full py-3")}>
                <span
                  className={clsx({
                    "opacity-0": isNil(card.price),
                  })}
                >
                  {card.price <= 0 ? t("Free") : getPriceCourse(card.price, card.moneyType)}
                </span>
              </div>
            </Flex>
          </div>
        </div>
      </CourseLink>
    </article>
  );
}
export default CourseCard;
