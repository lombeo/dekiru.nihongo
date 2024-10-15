import { Button } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { yupResolver } from "@hookform/resolvers/yup";
import { Image, Text } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import styles from "@src/components/Comment/Comment.module.scss";
import RawText from "@src/components/RawText/RawText";
import { ChatBubbleOval, Like, Pencil, RecycleBin, Unlike, ViewOff } from "@src/components/Svgr/components";
import { convertDate, processBreakSpaceComment } from "@src/helpers/fuction-base.helpers";
import { CommentService } from "@src/services/CommentService";
import { CommentContextType } from "@src/services/CommentService/types";
import { selectProfile } from "@src/store/slices/authSlice";
import { Editor } from "@tinymce/tinymce-react";
import clsx from "clsx";
import { cloneDeep, debounce, isNil } from "lodash";
import moment from "moment/moment";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from "yup";
import Link from "../Link";

interface CommentItemProps {
  data: any;
  openReplyItemId: number | null;
  contextId: number;
  contextType: number;
  setOpenReply: (id?: any) => void;
  refetch: () => void;
  isManager?: boolean;
  title: string;
  detailedLink: string;
  level: number;
}

const CommentItem = (props: CommentItemProps) => {
  const { t, i18n } = useTranslation();
  const {
    title,
    level = 0,
    detailedLink,
    data,
    setOpenReply,
    openReplyItemId,
    contextId,
    contextType,
    refetch,
    isManager,
  } = props;
  const content = data.message;

  const profile = useSelector(selectProfile);

  const [loading, setLoading] = useState(false);
  const [subData, setSubData] = useState<any>(null);
  const [isEdit, setIsEdit] = useState(false);
  const componentRef = useRef<any>(null);
  const editorRef = useRef(null);
  const replyEditorRef = useRef(null);
  const loadingPost = useRef(false);
  const [expand, setExpand] = useState(false);
  const [isLargeComment, setIsLargeComment] = useState(false);

  const fetchComments = async (pageIndex = 1) => {
    try {
      setLoading(true);
      const res = await CommentService.filter({
        contextId,
        contextType,
        pageSize: 10,
        pageIndex,
        parentId: data?.id,
      });
      if (res.data?.data) {
        setSubData((prev) => {
          const newData = cloneDeep(prev) || [];
          newData[pageIndex - 1] = res.data.data;
          return newData;
        });
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentsAfterPage = async (currentPage: number) => {
    const totalLoadedPage = (subData || []).length || 1;
    for (let i = currentPage; i <= totalLoadedPage; i++) {
      await fetchComments(i);
    }
  };

  const fetchMore = async () => {
    const nextPage = (subData || [])?.[subData.length - 1]?.currentPage + 1;
    await fetchComments(nextPage);
  };

  const initialValues: any = {
    message: "",
    contextId,
    id: data.id,
    contextType,
    userId: profile?.userId,
    parentId: null,
    createOrUpdate: 0,
  };

  useEffect(() => {
    reset({
      message: "",
      contextId,
      id: data.id,
      contextType,
      userId: profile?.userId,
      parentId: null,
      createOrUpdate: 0,
    });
  }, [contextId]);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(yup.object().shape({})),
  });

  const { control, handleSubmit, reset, watch } = methodForm;

  const message = processBreakSpaceComment(watch("message"));
  const isInvalid = isNil(message) || message == "";

  const handleClickSubmit = (isEdit?: boolean) => {
    if (loadingPost.current) return;
    if (isInvalid) {
      Notify.error(t("Comment must not be blank"));
      if (isEdit) {
        setIsEdit(false);
        reset(initialValues);
      }
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
          id: isEdit ? data.id : null,
          parentId: isEdit ? null : openReplyItemId,
          createOrUpdate: isEdit ? 1 : 0,
        });
        setIsEdit(false);
        reset(initialValues);
        !isEdit && fetchCommentsAfterPage(1);
        refetch();
      } catch (e) {
      } finally {
        loadingPost.current = false;
      }
    })();
  };
  const handleHide = debounce(async (commentId: number, userId: number) => {
    try {
      await CommentService.hide({
        commentId: commentId,
        userId: userId,
      });
      refetch();
    } catch (e) {}
  }, 300);

  const handleDelete = (id: number) => {
    confirmAction({
      message: t("Are you sure to delete the comment?"),
      onConfirm: async () => {
        try {
          await CommentService.delete(id);
          refetch();
        } catch (e) {}
      },
    });
  };

  const handleVote = useCallback(
    debounce(async (id: number, point: number) => {
      try {
        await CommentService.vote({
          contextType: CommentContextType.Comment,
          contextId: id,
          point: point,
        });
        refetch();
      } catch (e) {}
    }, 300),
    []
  );

  useEffect(() => {
    if (!isEdit) return;
    const handleOutsideClick = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        handleClickSubmit(true);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isEdit]);

  useEffect(() => {
    setTimeout(() => {
      const scrollHeight = document.getElementById(`comment-${data?.id}`)?.scrollHeight || 0;
      const clientHeight = document.getElementById(`comment-${data?.id}`)?.clientHeight || 0;
      setIsLargeComment(scrollHeight > clientHeight);
    }, 100);
  }, []);

  return (
    <div className="relative">
      {level > 0 && (
        <div className="absolute top-[48px] rounded-bl-[10px] left-[-54px] border-b border-l border-[#DFE4EA] w-[54px] h-6" />
      )}
      <div className="bg-navy-light5 p-4 pt-3 rounded-[12px]">
        <div className="text-sm">
          <div className="grid grid-cols-[auto_1fr] gap-3 items-center">
            <Avatar
              userExpLevel={data?.user?.userExpLevel}
              src={data?.user?.avatarUrl}
              userId={data?.user?.userId}
              size="md"
            />
            <div className="flex flex-col flex-none mt-1">
              <Link className="font-semibold" href={`/profile/${data?.user?.userId}`}>
                <TextLineCamp>{data?.user?.userName}</TextLineCamp>
              </Link>
              <div className="text-[#898989] flex-none text-xs">
                {moment(convertDate(data?.modifiedOn)).locale(i18n.language).fromNow()}
              </div>
            </div>
          </div>
          {!isEdit && (
            <div className="flex flex-col">
              <RawText
                className={clsx("mt-2 whitespace-pre-line", styles.content, data.isHidden ? "text-[#898989]" : "", {
                  expand: expand,
                })}
                id={`comment-${data?.id}`}
                content={content}
              />
              {!expand && isLargeComment && (
                <div className="text-primary cursor-pointer hover:opacity-80" onClick={() => setExpand(true)}>
                  {t("See more")}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {isEdit && (
        <div className="mt-4" ref={componentRef}>
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
                      handleClickSubmit(true);
                    }
                  }}
                  ref={editorRef}
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
        </div>
      )}
      <div className="mt-3">
        {data.isHidden ? (
          <div className="flex flex-wrap gap-2">
            <Text>{t("This comment has been hidden")}. </Text>
            <Text
              className="text-[#4d96ff] cursor-pointer hover:underline"
              onClick={() => handleHide(data?.id, data?.user?.userId)}
            >
              {t("Unhide")}
            </Text>
          </div>
        ) : (
          <div className="text-sm text-[#898989]">
            <div className="flex gap-6 items-center flex-wrap">
              <div
                onClick={() => handleVote(data.id, data?.userVotePoint <= 0 ? 1 : 0)}
                className="flex gap-1 items-center cursor-pointer hover:opacity-80"
              >
                <Like width={14} height={14} className={clsx({ "text-primary": data?.userVotePoint === 1 })} />
                <div>{data?.totalPoint || 0}</div>
              </div>
              <div
                onClick={() => handleVote(data.id, data?.userVotePoint >= 0 ? -1 : 0)}
                className="flex gap-1 items-center cursor-pointer hover:opacity-80"
              >
                <Unlike width={14} height={14} className={clsx({ "text-primary": data?.userVotePoint === -1 })} />
                <div>{data?.totalNegativePoint || 0}</div>
              </div>
              <div
                onClick={() => {
                  setIsEdit(false);
                  setOpenReply(data?.id);
                  reset({ ...initialValues });
                  setTimeout(() => {
                    replyEditorRef.current?.editor?.focus?.();
                  }, 200);
                }}
                className="flex gap-1 items-center cursor-pointer hover:opacity-80"
              >
                <ChatBubbleOval width={14} height={14} />
                <div>{t("Reply")}</div>
              </div>
              {(!!profile && profile?.userId === data?.user?.userId) || isManager ? (
                <div
                  onClick={() => handleHide(data?.id, data?.user?.userId)}
                  className="flex gap-2 items-center cursor-pointer hover:opacity-80"
                >
                  <ViewOff width={18} height={18} />
                  {t("Hide")}
                </div>
              ) : null}
              {!!profile && profile?.userId === data?.user?.userId && (
                <div
                  onClick={() => {
                    setOpenReply(null);
                    setIsEdit(true);
                    setTimeout(() => {
                      editorRef.current?.editor?.focus?.();
                    }, 200);
                    reset({ ...initialValues, message: data.message });
                  }}
                  className="flex gap-2 items-center cursor-pointer hover:opacity-80"
                >
                  <Pencil width={14} height={14} />
                  {t("Edit")}
                </div>
              )}
              {(!!profile && profile?.userId === data?.user?.userId) || isManager ? (
                <div
                  onClick={() => handleDelete(data?.id)}
                  className="flex gap-2 items-center cursor-pointer hover:opacity-80"
                >
                  <RecycleBin width={14} height={14} />
                  {t("Delete")}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
      {!data.isHidden && (
        <div className="mt-4 grid gap-2 pl-[54px]">
          {subData && (
            <div className="relative">
              <div className="absolute left-[-54px] top-0 bottom-[100px] w-[1px] bg-[#DFE4EA]" />
              <div>
                {subData.map((comment: any) =>
                  comment?.results?.map((e: any) => (
                    <CommentItem
                      key={e.id}
                      data={e}
                      title={title}
                      detailedLink={detailedLink}
                      isManager={isManager}
                      contextType={contextType}
                      contextId={contextId}
                      level={level + 1}
                      refetch={() => fetchCommentsAfterPage(comment.currentPage)}
                      openReplyItemId={openReplyItemId}
                      setOpenReply={(id) => {
                        if (id) {
                          setOpenReply(data.id);
                          reset({
                            ...initialValues,
                          });
                          setTimeout(() => {
                            replyEditorRef.current?.editor?.focus?.();
                          }, 200);
                        } else {
                          setOpenReply(null);
                        }
                      }}
                    />
                  ))
                )}
                {subData?.[0] && subData[0].pageCount > subData.length ? (
                  <div className="flex justify-center">
                    <Button disabled={loading} variant="default" onClick={fetchMore} size="sm">
                      {t("See more")}
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          )}
          {data.numOfReply === 1 && !subData?.[0] && (
            <div onClick={() => fetchComments(1)} className="flex items-center gap-3 cursor-pointer hover:opacity-80">
              <Image src="/images/learning/arrow-bend-right.png" width={24} height={24} alt="arrow-bend-right" />
              <Avatar userExpLevel={data?.userReply?.userExpLevel} src={data?.userReply?.avatarUrl} size="md" />
              <div className="flex flex-col flex-none mt-1">
                <TextLineCamp className="font-semibold text-sm">
                  {data?.userReply?.userName} {t("was replied")}
                </TextLineCamp>
                <div className="text-[#898989] flex-none text-xs">
                  {data?.lastReplyOn && moment(convertDate(data?.lastReplyOn)).locale(i18n.language).fromNow()}
                </div>
              </div>
            </div>
          )}
          {data.numOfReply > 1 && !subData?.[0] && (
            <div
              onClick={() => fetchComments(1)}
              className="flex items-center gap-2 w-fit  cursor-pointer hover:opacity-80"
            >
              <Image src="/images/learning/arrow-bend-right.png" width={24} height={24} alt="arrow-bend-right" />
              <div>
                {t("See all")} {data.numOfReply} {t("replies")}
              </div>
            </div>
          )}
          {!!profile && data?.id && openReplyItemId === data.id && !isEdit && (
            <>
              <div className="flex flex-col">
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
                <Button
                  className="ml-auto my-4"
                  color="dark"
                  disabled={isInvalid}
                  size="sm"
                  onClick={() => handleClickSubmit()}
                >
                  {t("Submit a comment")}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
