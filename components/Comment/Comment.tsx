import { Button } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Skeleton } from "@mantine/core";
import { getAccessToken } from "@src/api/axiosInstance";
import Avatar from "@src/components/Avatar";
import CommentItem from "@src/components/Comment/CommentItem";
import { processBreakSpaceComment } from "@src/helpers/fuction-base.helpers";
import { CommentService } from "@src/services/CommentService";
import { selectProfile } from "@src/store/slices/authSlice";
import { Editor } from "@tinymce/tinymce-react";
import { cloneDeep, isNil } from "lodash";
import "moment/locale/vi";
import { useTranslation } from "next-i18next";
import Prism from "prismjs";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-tomorrow.css";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from "yup";
import styles from "./Comment.module.scss";

interface CommentProps {
  contextId: number;
  contextType: number;
  isManager?: boolean;
  fetchedCallback?: (data: any) => void;
  detailedLink: string;
  title: string;
}
const Comment = (props: CommentProps) => {
  const { detailedLink, title, contextId, contextType, isManager, fetchedCallback } = props;
  const profile = useSelector(selectProfile);
  const token = getAccessToken();
  const { t } = useTranslation();
  const [openReplyItemId, setOpenReplyItemId] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const loadingPost = useRef(false);
  const [loadingFirst, setLoadingFirst] = useState(true);

  const fetchComments = async (pageIndex = 1, contextId: number) => {
    if (!contextId) return;
    try {
      setLoading(true);
      const res = await CommentService.filter({
        contextId,
        contextType,
        pageSize: 10,
        pageIndex,
        parentId: null,
      });
      if (res.data.data) {
        fetchedCallback?.(res.data.data);
        setData((prev) => {
          const newData = cloneDeep(prev) || [];
          newData[pageIndex - 1] = res.data.data;
          return newData;
        });
        setTimeout(() => {
          Prism.highlightAll();
        }, 100);
      }
    } catch (e) {
    } finally {
      setLoading(false);
      setLoadingFirst(false);
    }
  };

  const fetchCommentsAfterPage = async (currentPage: number) => {
    const totalLoadedPage = data.length;
    for (let i = currentPage; i <= totalLoadedPage; i++) {
      await fetchComments(i, contextId);
    }
  };

  const fetchMore = async () => {
    const nextPage = data?.[data.length - 1]?.currentPage + 1;
    await fetchComments(nextPage, contextId);
  };

  useEffect(() => {
    if (!token) return;
    fetchComments(1, contextId);
    reset({
      message: "",
      contextId,
      contextType,
      userId: profile?.userId,
      createOrUpdate: 0,
    });
  }, [contextId, token]);

  const initialValues: any = {
    message: "",
    contextId,
    contextType,
    userId: profile?.userId,
    createOrUpdate: 0,
  };

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(yup.object().shape({})),
  });

  const { control, handleSubmit, reset, watch } = methodForm;

  const message = processBreakSpaceComment(watch("message"));
  const isInvalid = isNil(message) || message == "";

  const handleClickSubmit = () => {
    if (loadingPost.current) return;
    if (isInvalid) {
      Notify.error(t("Comment must not be blank"));
      return;
    }
    handleSubmit(async (data) => {
      loadingPost.current = true;
      const message = processBreakSpaceComment(data.message);
      try {
        await CommentService.post({
          ...data,
          title,
          detailedLink,
          message: message,
        });
        reset(initialValues);
        fetchCommentsAfterPage(1);
      } catch (e) {
      } finally {
        loadingPost.current = false;
      }
    })();
  };

  if (!token) return null;

  return (
    <div className="flex flex-col mb-8">
      {/* <Text className="text-base font-semibold">
        {data?.[0]?.total ? `${data[0].total} ${t("comments")}` : t("Comment")}
      </Text> */}
      {profile ? (
        <>
          <div className="mt-5 grid gap-1 grid-cols-[54px_auto]">
            <Avatar userExpLevel={profile?.userExpLevel} src={profile?.avatarUrl} userId={profile?.userId} size="lg" />
            <Controller
              name="message"
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
                      paste_preprocess: function (plugin, args) {
                        args.content = args.content.replace(/<img[^>]*>/g, "");
                      },
                    }}
                    tinymceScriptSrc={"https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.7.0/tinymce.min.js"}
                  />
                </div>
                // <Textarea
                //   {...field}
                //   minRows={3}
                //   placeholder={t("Write your comment")}
                //   onKeyDown={(e) => {
                //     if (e.keyCode == 13) {
                //       if (e.shiftKey) {
                //         return;
                //       }
                //       e.preventDefault();
                //       e.stopPropagation();
                //       handleClickSubmit();
                //     }
                //   }}
                // />
              )}
            />
          </div>
          <Button disabled={isInvalid} className="ml-auto mt-4" color="dark" size="sm" onClick={handleClickSubmit}>
            {t("Submit a comment")}
          </Button>
        </>
      ) : null}

      <div className="mt-6">
        {loadingFirst && (
          <>
            {[1, 2].map((e, idx) => (
              <div key={idx}>
                <div className="grid gap-1 grid-cols-[54px_auto] mb-4">
                  <div className="relative w-[40px] h-[40px] mt-0">
                    <Skeleton height={44} width={44} radius="xl" />
                  </div>
                  <div className="border-b pb-5 text-sm">
                    <div className="flex gap-x-2 w-full flex-wrap mb-3">
                      <Skeleton height={20} width={180} />
                    </div>
                    <Skeleton height={60} width={idx % 2 === 0 ? 330 : 240} />
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        <div className="flex flex-col gap-8">
          {!loadingFirst &&
            data?.map((comment) =>
              comment?.results?.map((e) => (
                <CommentItem
                  isManager={isManager}
                  key={e.id}
                  contextId={contextId}
                  contextType={contextType}
                  openReplyItemId={openReplyItemId}
                  data={e}
                  title={title}
                  detailedLink={detailedLink}
                  level={0}
                  refetch={() => fetchCommentsAfterPage(comment.currentPage)}
                  setOpenReply={setOpenReplyItemId}
                />
              ))
            )}
        </div>
        {data?.[0] && data[0].pageCount > data.length ? (
          <div className="flex justify-center">
            <Button disabled={loading} variant="default" onClick={fetchMore} size="sm">
              {t("See more")}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Comment;
