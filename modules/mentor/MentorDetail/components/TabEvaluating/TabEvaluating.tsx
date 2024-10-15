import { Button, Text } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Collapse, Progress } from "@mantine/core";
import RawText from "@src/components/RawText/RawText";
import StarRatings from "@src/components/StarRatings";
import { MiscDot01XsIcon } from "@src/components/Svgr/components";
import { convertDate, processBreakSpaceComment } from "@src/helpers/fuction-base.helpers";
import { useRouter } from "@src/hooks/useRouter";
import { LearnCourseService } from "@src/services";
import { CommentContextType } from "@src/services/CommentService/types";
import { MentorState } from "@src/services/LearnMentor/types";
import { selectProfile } from "@src/store/slices/authSlice";
import { Editor } from "@tinymce/tinymce-react";
import clsx from "clsx";
import { isNil } from "lodash";
import moment from "moment";
import "moment/locale/vi";
import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from "yup";
import styles from "./BoxEvaluating.module.scss";

interface TabEvaluatingProps {
  mentors: any;
  refetchDetail: () => any;
}

const TabEvaluating = (props: TabEvaluatingProps) => {
  const { mentors, refetchDetail } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const id = +router.query.id as any;

  const profile = useSelector(selectProfile);

  const [isShowLesson, setIsShowLesson] = useState(false);
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const loadingPost = useRef(false);
  const replyEditorRef = useRef(null);

  const initialValues: any = {
    point: 5,
    comment: "",
  };

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(yup.object().shape({})),
  });

  const { control, handleSubmit, setValue, reset, watch } = methodForm;

  useEffect(() => {
    fetch();
  }, [id]);

  const fetch = async () => {
    try {
      const response = await LearnCourseService.getCourseRatings({
        pageIndex: 1,
        pageSize: 20,
        contextId: id,
        contextType: CommentContextType.Mentor,
        getDetails: true,
      });
      const data = response?.data?.data;
      if (data) {
        setData(data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleClickSubmit = (isEdit?: boolean) => {
    if (loadingPost.current) return;
    const message = processBreakSpaceComment(watch("comment"));
    if (isNil(message) || message == "") {
      Notify.error(t("Comment must not be blank"));
      if (isEdit) {
        reset(initialValues);
      }
      return;
    }
    handleSubmit(async (data) => {
      loadingPost.current = true;
      const comment = processBreakSpaceComment(data.comment);
      try {
        const res = await LearnCourseService.rateCourse({
          comment: comment,
          contextId: id,
          point: data.point,
          contextType: CommentContextType.Mentor,
        });
        if (res?.data?.success) {
          reset(initialValues);
          refetchDetail();
          fetch();
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
      } catch (e) {
      } finally {
        loadingPost.current = false;
      }
    })();
  };

  const isApproved = profile && mentors?.some((e) => e.mentorId === id && e.state === MentorState.Approved);

  return (
    <div className="bg-white rounded-md shadow-md p-5 flex flex-col">
      <div className="flex gap-10 mt-5">
        <div className="flex flex-col text-center">
          <Text className="text-[72px] leading-[80px] font-semibold">
            {data?.averageRating ? data?.averageRating?.toFixed(1) : 5}
          </Text>
          <StarRatings size="md" rating={data?.averageRating} />
          <Text className="font-semibold text-sm">({data?.rowCount || 0})</Text>
        </div>

        <div className="flex gap-1 flex-col">
          {[5, 4, 3, 2, 1].map((key, idx) => {
            const percentage = data?.percentages?.find((e) => e.key === key)?.value || 0;
            return (
              <div key={idx} className="flex items-center gap-5">
                <StarRatings size="lg" rating={key} />
                <div className="flex-auto h-6 w-[248px] py-2 ml-2">
                  <Progress value={percentage} color="#F9BF08" size="md" radius="md" />
                </div>
                <Text className="text-sm w-[2rem] flex-none text-right">{percentage}%</Text>
              </div>
            );
          })}
        </div>
      </div>

      {isApproved && (
        <div className="relative flex flex-col gap-2 mt-5">
          <StarRatings
            rating={watch("point")}
            size="lg"
            changeRating={(point) => setValue("point", point, { shouldValidate: false })}
          />
          <Controller
            name="comment"
            control={control}
            render={({ field }) => (
              <div className={styles["editor"]}>
                <Editor
                  value={field.value}
                  onEditorChange={(e) => {
                    if (loadingPost.current) return;
                    field.onChange(e);
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode == 13) {
                      if (e.shiftKey) {
                        return;
                      }
                      e.preventDefault();
                      e.stopPropagation();
                      handleClickSubmit();
                    }
                  }}
                  ref={replyEditorRef}
                  init={{
                    indent: false,
                    branding: false,
                    menubar: false,
                    toolbar: false,
                    file_browser_callback: false,
                    quickbars_selection_toolbar: false,
                    quickbars_insert_toolbar: false,
                    statusbar: false,
                    convert_urls: false,
                    placeholder: t("Write your comment"),
                    content_css: "/editor.css",
                  }}
                  tinymceScriptSrc={"https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.7.0/tinymce.min.js"}
                />
              </div>
            )}
          />
          <Button className="ml-auto mt-2" size="sm" onClick={handleClickSubmit}>
            {t("Post")}
          </Button>
        </div>
      )}

      <div className="md:pt-8 pt-6">
        {!!data?.results && data?.results?.length > 0 && (
          <>
            <div className="flex flex-col gap-4">
              {[...data.results]?.slice(0, 5)?.map((item, idx) => (
                <Item key={idx} data={item} />
              ))}
              <Collapse in={isShowLesson}>
                <div className="flex flex-col gap-4">
                  {[...data.results]?.slice(5)?.map((item, idx) => (
                    <Item key={idx} data={item} />
                  ))}
                </div>
              </Collapse>
              {data.rowCount > 5 && (
                <div className="max-w-32 mx-auto">
                  <Button size="sm" variant="default" onClick={() => setIsShowLesson((prev) => !prev)}>
                    {isShowLesson ? t("See less") : t("See more")}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Item = (props: { data: any }) => {
  const { data } = props;
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;

  const [expand, setExpand] = useState(false);
  const [isLargeComment, setIsLargeComment] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const scrollHeight = document.getElementById(`comment-${data?.id}`)?.scrollHeight || 0;
      const clientHeight = document.getElementById(`comment-${data?.id}`)?.clientHeight || 0;
      setIsLargeComment(scrollHeight > clientHeight);
    }, 100);
  }, []);

  moment.locale(locale);

  const fullName = data.fullName || data.userName;

  return (
    <div className=" bg-[#F3F4F7] rounded-sm px-4 py-3">
      <Text className="text-sm text-gray-primary flex items-center">
        {fullName} <MiscDot01XsIcon size="3xl" /> {moment(convertDate(data.modifiedOn)).fromNow()}
      </Text>
      <StarRatings rating={data.point} />
      {!isNil(data.comment) && (
        <div className="flex flex-col">
          <RawText
            className={clsx("mt-2 whitespace-pre-line", styles.content, data.isHidden ? "text-[#898989]" : "", {
              expand: expand,
            })}
            id={`comment-${data?.id}`}
            content={data.comment}
          />
          {!expand && isLargeComment && (
            <div className="text-primary cursor-pointer hover:opacity-80" onClick={() => setExpand(true)}>
              {t("See more")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TabEvaluating;
