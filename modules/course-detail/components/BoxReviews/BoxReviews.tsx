import { ChatBoxHelper } from "@chatbox/helper/functions-base.helper";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Collapse, Progress, Textarea, clsx } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import RawText from "@src/components/RawText/RawText";
import StarRatings from "@src/components/StarRatings";
import { FunctionBase, convertDate } from "@src/helpers/fuction-base.helpers";
import { LearnCourseService } from "@src/services";
import { CommentContextType } from "@src/services/CommentService/types";
import yup from "@src/validations/yupGlobal";
import { isEmpty } from "lodash";
import moment from "moment";
import "moment/locale/vi";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Controller, useForm } from "react-hook-form";
import styles from "./BoxReviews.module.scss";

interface BoxReviewsProps {
  data: any;
  refreshData: () => void;
  courseId: number;
  isEnroll: boolean;
}

const BoxReviews = (props: BoxReviewsProps) => {
  const { data, refreshData, isEnroll, courseId } = props;

  const { t } = useTranslation();

  return (
    <div id="reviews" className="flex flex-col gap-8">
      <h3 className="my-0 text-[24px]">{t("Feedback")}</h3>
      <div className="bg-navy-light5 overflow-hidden rounded-[12px] lg:p-8 p-6 gap-6 grid lg:grid-cols-[240px_1fr]">
        <div>
          <div className="text-[40px] font-semibold mb-2">{(data?.averageRating || 0)?.toFixed(1)}</div>
          <div>
            <StarRatings size="xl" rating={data?.averageRating || 0} />
          </div>
          <div className="mt-3 text-[#8899A8] font-semibold text-sm">
            ({FunctionBase.formatNumber(data?.rowCount)} {t(data?.rowCount > 1 ? "reviews" : "review")})
          </div>
        </div>
        <div>
          <div className="flex gap-5 flex-col">
            {[5, 4, 3, 2, 1].map((key, idx) => {
              const percentage = data?.percentages?.find((e) => e.key === key)?.value || 0;
              return (
                <div key={idx} className="grid grid-cols-[50px_1fr_40px] items-center gap-1">
                  <div className="text-sm font-semibold">
                    {key} {t(key > 1 ? "stars" : "star")}
                  </div>
                  <div className="flex-auto h-6 py-2 ml-2">
                    <Progress value={percentage} color="#FBBF24" size="md" radius="md" />
                  </div>
                  <div className="text-sm font-semibold text-[#8899A8] text-right">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {isEnroll && <FromRating refreshData={refreshData} courseId={courseId} />}
      <Reviews data={data} />
    </div>
  );
};

export default BoxReviews;

interface FromRatingProps {
  courseId: number;
  refreshData: () => void;
}

const FromRating = (props: FromRatingProps) => {
  const { courseId, refreshData } = props;

  const { t } = useTranslation();

  const initialValues: any = {
    point: 5,
    comment: "",
    courseId: courseId,
  };

  const getSchemaValidateFormFeedback = () => {
    return yup.object().shape({
      comment: yup
        .string()
        .required(t("Comment must not be blank"))
        .trim(t("Comment must not be blank"))
        .max(512, t("Your comment must be less than 512 characters")),
    });
  };

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(getSchemaValidateFormFeedback()),
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = methodForm;

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleClickSubmit = (event: any) => {
    event.preventDefault();
    handleSubmit(async (data) => {
      if (isEmpty(watch("comment")?.trim())) {
        Notify.error(t("Comment must not be blank"));
        return;
      }
      if (!executeRecaptcha) {
        console.log(t("Execute recaptcha not yet available"));
        return;
      }
      executeRecaptcha("enquiryFormSubmit").then((gReCaptchaToken) => {
        submitEnquiryForm(data, gReCaptchaToken);
      });
    })();
  };

  const submitEnquiryForm = async (data, gReCaptchaToken) => {
    const response = await LearnCourseService.rateCourse({
      ...data,
      contextId: courseId,
      contextType: CommentContextType.Course,
    });
    if (response.data.success) {
      Notify.success(t("Feedback this course successfully!"));
      reset(initialValues);
      refreshData();
    } else {
      if (response.data?.message && response.data?.message != "") {
        Notify.error(t(response.data?.message));
      } else {
        Notify.error(t("Feedback this course failed!"));
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Controller
        name="comment"
        control={control}
        render={({ field }) => (
          <Textarea
            placeholder={t("Enter your review here")}
            withAsterisk
            minRows={5}
            classNames={{
              input: "rounded-[12px]",
            }}
            rows={5}
            {...field}
          />
        )}
      />
      <div className="flex flex-wrap gap-5 justify-between items-center">
        <StarRatings
          rating={watch("point")}
          size="lg"
          changeRating={(point) => setValue("point", point, { shouldValidate: false })}
        />
        <Button disabled={isEmpty(watch("comment")?.trim())} size="sm" color="dark" onClick={handleClickSubmit}>
          {t("Submit a review")}
        </Button>
      </div>
    </div>
  );
};

interface ReviewProps {
  data: any;
}

const Reviews = (props: ReviewProps) => {
  const { data } = props;

  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  if (!data?.results || data?.results?.length <= 0) return null;

  return (
    <div className="flex flex-col gap-8">
      {[...data.results]?.slice(0, 5)?.map((item, idx) => (
        <Item key={idx} data={item} />
      ))}
      <Collapse in={isOpen}>
        <div className="flex flex-col gap-8">
          {[...data.results]?.slice(5)?.map((item, idx) => (
            <Item key={idx} data={item} />
          ))}
        </div>
      </Collapse>
      {data.rowCount > 5 && (
        <div className="max-w-32">
          <Button size="sm" variant="default" onClick={() => setIsOpen((prev) => !prev)}>
            {isOpen ? t("See less") : t("See more")}
          </Button>
        </div>
      )}
    </div>
  );
};

const Item = (props: { data: any }) => {
  const { data } = props;

  const router = useRouter();
  const locale = router.locale;
  moment.locale(locale);

  const name = data.fullName || data.userName;
  const date = moment(convertDate(data.modifiedOn || data.createdOn)).format("ll");

  return (
    <div className="border-b flex flex-col gap-3 border-[#E5E7EB] pb-8">
      <div className="grid grid-cols-[auto_1fr] gap-3 items-center">
        <Avatar userExpLevel={data?.userExpLevel} src={data?.avatar} userId={data?.user?.userId} size="md" />
        <div className="flex flex-col flex-none mt-1">
          <Link className="font-semibold" href={`/profile/${data?.user?.userId}`}>
            <TextLineCamp>{name}</TextLineCamp>
          </Link>
          <div className="text-[#898989] flex items-center gap-3 flex-none text-xs">
            {date} <StarRatings rating={data.point} size="sm" />
          </div>
        </div>
      </div>
      <div
        style={{ whiteSpace: "break-spaces", wordBreak: "break-word" }}
        className={clsx(styles["comment"], "text-sm")}
      >
        <RawText content={ChatBoxHelper.Linkify(FunctionBase.htmlEncode(data.comment))} />
      </div>
    </div>
  );
};
