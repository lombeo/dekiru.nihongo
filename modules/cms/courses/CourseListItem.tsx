import Link from "@src/components/Link";
import { AppIcon } from "@src/components/cms/core/Icons";
import { COMMON_FORMAT } from "@src/constants/cms/common-format";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage } from "@src/helpers/helper";
import { Badge, Card, Image, Text } from "components/cms";
import TextOverflow from "components/cms/core/TextOverflow";
import moment from "moment";
import "moment/locale/vi";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { LocaleKeys } from "public/locales/locale";
import styles from "./CourseListItem.module.css";

const CoursePublishTag = ({ published }: any) => {
  const { t } = useTranslation();
  const draftClass = !published ? " bg-white text-blue-500 shadow" : "";
  return (
    <div className={`absolute left-6 bottom-4 shadow-depth-sm`}>
      <Badge
        radius="sm"
        className={"capitalize font-normal shadow-md text-sm h-6" + draftClass}
        color={published ? "blue" : ""}
        variant="filled"
      >
        {published ? t(LocaleKeys["Published"]) : t(LocaleKeys["Draft"])}
      </Badge>
    </div>
  );
};

const CourseComboTag = () => {
  const { t } = useTranslation();
  return (
    <div className={`absolute right-6 bottom-4 shadow-depth-sm`}>
      <Badge radius="sm" className={"capitalize font-normal shadow-md text-sm h-6"} color={"pink"} variant="filled">
        {t("Combo")}
      </Badge>
    </div>
  );
};

export const CourseListItem = ({ data }: any) => {
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;
  moment.locale(locale);

  const getCoursePrice = (price: number, moneyType: number) => {
    if (moneyType === 1) {
      return price
        ? FunctionBase.formatNumber(price, {
            style: "currency",
            currency: "VND",
          })
        : t(LocaleKeys["FREE"]);
    } else {
      return price
        ? FunctionBase.formatNumber(price * 25000, {
            style: "currency",
            currency: "VND",
          })
        : t(LocaleKeys["FREE"]);
    }
  };

  const PropertyDetail = ({
    icon,
    text,
    className,
  }: {
    icon: string | undefined;
    text?: string | undefined;
    className?: any;
  }) => {
    return (
      <div className={`flex gap-1 items-center ${className ?? ""}`}>
        <AppIcon name={icon} size="sm" className="w-5" />
        <TextOverflow style={{ width: "calc(100% - 1.25rem)" }}>{text}</TextOverflow>
      </div>
    );
  };

  const category = resolveLanguage(data.category, locale);
  const dataLang = resolveLanguage(data, locale);
  const title = dataLang?.title;

  return (
    <Link href={`/cms/course/${data.id}`}>
      <Card withBorder className={styles.item}>
        <Card.Section className={styles.wrapThumb}>
          <div className={styles.thumbnail}>
            <Image src={data.thumbnail} height={210} alt="CodeLearn" fit="cover" withPlaceholder />
            <CoursePublishTag published={data.published} />
            {data.isCombo && <CourseComboTag />}
          </div>
        </Card.Section>
        <TextOverflow title={title} line={1} className="font-semibold mb-1">
          {title}
        </TextOverflow>
        <TextOverflow title={category?.title} line={1} className="font-semibold text-sm text-blue-500 mb-4">
          {category?.title}
        </TextOverflow>
        <div className="grid grid-cols-2 flex-wrap gap-2 text-sm text-gray-primary mb-2">
          <PropertyDetail
            className="lowercase mb-2"
            icon="notepad_person"
            text={data.ownerName ? data.ownerName : "user"}
          />
          <PropertyDetail
            className="mb-2"
            icon="calendar_ltr"
            text={moment(data.createdOn ? data.createdOn : new Date()).format(COMMON_FORMAT.MONTH_YEAR)}
          />
        </div>
        <Text weight={600}>{getCoursePrice(data.price, data.moneyType)}</Text>
      </Card>
    </Link>
  );
};
