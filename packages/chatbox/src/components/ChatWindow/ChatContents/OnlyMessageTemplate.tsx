import { ChatBoxHelper } from "@chatbox/helper/functions-base.helper";
import { useSendMessage } from "@chatbox/hook/useChatSocket";
import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { Button, Textarea } from "@mantine/core";
import RawText from "@src/components/RawText/RawText";
import { MessageLoading } from "@src/components/Svgr/components";
import { PubsubTopic } from "@src/constants/common.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { getAnonymousUser } from "@src/hooks/useJwtToken";
import { selectProfile } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import { KeyboardEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import styles from "../../ChatRoomItem/ChatItem.module.scss";
import FileDisplayTemplate from "./FileDisplayTemplate";
import MessageButtonsTemplate from "./MessageButtonsTemplate";

/**
 *
 * @param props
 * @returns template message content
 */
const OnlyMessageTemplate = (props: any) => {
  const { isActive, isCurrentUser, roomId, isPrivate } = props;
  const message = props.data;
  const { t } = useTranslation();

  const profile = useSelector(selectProfile);

  const { sendMessage } = useSendMessage();

  const [isEdtting, setIsEdtting] = useState(false);
  const [isDisableEdit, setIsDisableEdit] = useState(false);
  const anonymousUser = getAnonymousUser();

  const defaultFormValue = {
    content: "",
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormValue,
  });

  //Typing message
  const onTyping = (value: any) => {
    if (value.trim()?.length > 0) {
      setIsDisableEdit(false);
    } else {
      setIsDisableEdit(true);
    }
  };

  //Handle enter
  const handleOnEnter = (e: KeyboardEvent<HTMLTextAreaElement>, messId: string) => {
    if (e.keyCode == 13) {
      if (e.shiftKey) {
        return;
      }
      //Trigger click button submit
      const btnEdit = document.getElementById(`button-reply-${messId}`);
      if (btnEdit != null) {
        btnEdit.focus();
        btnEdit.click();
        e.currentTarget.focus();
        e.preventDefault();
      }
    }
  };

  //Handle edit
  const handleEdit = (messId: string) => {
    setIsEdtting(true);
    setValue("content", FunctionBase.htmlDecode(message?.data?.text));
    setTimeout(function () {
      const txtRep: any = document.getElementById(`txt-reply-${messId}`);
      if (txtRep != null) {
        txtRep.value = FunctionBase.htmlDecode(message?.data?.text);
        txtRep.focus();
      }
    }, 200);
  };

  //Edit message
  const editMessage = (values) => {
    if (values?.content?.length > 0) {
      let updateContent = values?.content;
      let replyObj = null;
      let dom_reply = document.getElementById(`message-content-reply-${message.id}`);
      if (dom_reply != null && !dom_reply.classList.contains("hidden")) {
        replyObj = JSON.parse(dom_reply.getAttribute("data-reply-object"));
      }
      const currentUserId = profile ? profile?.userId : anonymousUser?.userId;
      if (window?.navigator && !window.navigator.onLine) {
        Notify.warning(t("Internet connection is interrupted. Please try again!"));
        PubSub.publish(PubsubTopic.CONNECT_CHAT_SOCKET);
        return;
      }
      if (!currentUserId) return;
      let messageUpdate = ChatBoxHelper.MessageData(
        message.id,
        "EDIT_MESSAGE",
        updateContent,
        "",
        replyObj,
        isPrivate,
        currentUserId
      );
      sendMessage(roomId, messageUpdate);
      setIsEdtting(false);
      //Un Disable button
      let buttonUpload = document.getElementById(`chat-upload-btn-${roomId}`);
      if (buttonUpload != null) {
        if (buttonUpload.classList.contains("btn-disabled")) {
          buttonUpload.classList.remove("btn-disabled");
        }
      }
    }
  };
  function isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  const renderTemplate = () => {
    if (message.type === "LOADING") {
      return (
        <div
          className={"message max-w-full " + (isCurrentUser ? "text-right" : "text-left")}
          id={`message-${message.id}`}
          data-id={message.id}
          data-time-stamp={message.timestamp}
        >
          <div className={`${styles["wrap-detail-message"]} relative inline-block`}>
            <div
              className={`message-content rounded-md border border-[#CCCCCC] px-3 py-1 h-[34px] flex items-center ${
                isCurrentUser ? "bg-[#EEEFFF]" : "bg-white"
              } `}
              style={{ backgroundColor: message.deleted ? "#C9C9C9" : "" }}
            >
              <MessageLoading color="#999" height={20} width={40} />
            </div>
          </div>
        </div>
      );
    }

    let text = message.data !== undefined ? message?.data?.text : "";
    let files = message.data !== undefined ? message?.data?.url : "";
    let replyObj = message.data !== undefined ? message?.data?.replyObject : "";
    let fileHtml: any = "";
    let cssClass = "message";
    let classDelete = "";
    if (message.deleted) {
      text = t("This message is deleted.");
      cssClass += " message-removed";
      classDelete += " bg-gray-light text-sm italic";
    } else {
      if (typeof files != "undefined" && files?.length > 0) {
        fileHtml = <FileDisplayTemplate files={files} />;
      }
    }
    let after = "";
    if (message.updatedTime !== undefined && !message.deleted) {
      cssClass += " message-edited";
      after = t("Edited");
    }
    let replyContent: any = "";
    if (!!replyObj) {
      let replyObjParse: any = {};
      if (isJsonString(replyObj)) replyObjParse = JSON.parse(replyObj);

      let headingReply: any = "";
      headingReply = (
        <h4 title={replyObjParse.userName} className={`${styles["reply-author"]} m-0 fs-12 truncate`}>
          {replyObjParse.userName}
        </h4>
      );
      let fileReply: any = "";
      let file = replyObjParse.url;
      let replyText = ChatBoxHelper.decodeQuote(replyObjParse.text);
      if (file?.length > 0) {
        let currentFile: any = FunctionBase.isJsonString(file[0]) ? JSON.parse(file[0]) : file[0];
        const isFile = currentFile.type == "file";
        let isPdf = !!currentFile.name && currentFile.name.match(".pdf") != null;
        fileReply = (
          <p className="reply-file mg-b-3 font-italic text-blue">
            <a href={currentFile.url} target={!isFile || isPdf ? "_blank" : ""} rel="noreferrer" download={isFile}>
              {currentFile.type == "image" ? (
                <span className="flex items-center gap-1">
                  <Icon name="image" size={16} /> {t("Image")}
                </span>
              ) : (
                <></>
              )}
              {currentFile.type == "video" ? (
                <span className="flex items-center gap-1">
                  <Icon name="play-video" size={16} /> {t("Video")}
                </span>
              ) : (
                <></>
              )}
              {currentFile.type == "file" ? (
                <span className="flex items-center gap-1">
                  <Icon name="attachment" size={16} /> {t("Attachment file")}
                </span>
              ) : (
                <></>
              )}
            </a>
          </p>
        );
      }
      replyContent = (
        <div
          id={`message-content-reply-${message.id}`}
          className={`${styles["content-reply"]} fs-14 text-left`}
          data-reply-for={replyObjParse.id}
          data-reply-object={`${ChatBoxHelper.encodeSingleQuote(JSON.stringify(replyObj))}`}
        >
          {headingReply}
          <div className="wrap-content-reply">
            {fileReply}
            <div
              title={FunctionBase.escapeForTitleAttribute(FunctionBase.htmlDecode(replyText))}
              className="message-text"
              style={{ whiteSpace: "break-spaces", wordBreak: "break-word" }}
            >
              <RawText content={ChatBoxHelper.Linkify(replyText)} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div
        className={cssClass + " max-w-full " + (isCurrentUser ? "text-right" : "text-left")}
        id={`message-${message.id}`}
        data-id={message.id}
        data-time-stamp={message.timestamp}
      >
        {replyContent}
        {renderFormEdit(message.id)}
        <div className={`${styles["wrap-detail-message"]} relative inline-block`}>
          <div
            className={`message-content rounded-md border border-[#CCCCCC] px-3 py-1 ${
              isCurrentUser ? "bg-[#EEEFFF]" : "bg-white"
            } ${classDelete} ${isEdtting ? "hidden" : ""}`}
            style={{ backgroundColor: message.deleted ? "#C9C9C9" : "" }}
          >
            {fileHtml}
            <div
              // title={FunctionBase.escapeForTitleAttribute(FunctionBase.htmlDecode(text))}
              className={`${styles["message-text"]} text-left`}
              data-after={after}
              data-content={FunctionBase.escapeForTitleAttribute(FunctionBase.htmlDecode(text))}
              style={{ whiteSpace: "break-spaces", wordBreak: "break-word" }}
            >
              <RawText content={ChatBoxHelper.Linkify(text)} />
            </div>
          </div>
          {!message.deleted && isActive ? (
            <MessageButtonsTemplate
              handleEdit={() => handleEdit(message.id)}
              isPrivate={isPrivate}
              roomId={roomId}
              message={message}
              fileHtml={fileHtml == ""}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  };

  //const cancel edit
  const cancelEdit = () => {
    setIsEdtting(false);
    //Un Disable button
    let buttonUpload = document.getElementById(`chat-upload-btn-${roomId}`);
    if (buttonUpload != null) {
      if (buttonUpload.classList.contains("btn-disabled")) {
        buttonUpload.classList.remove("btn-disabled");
      }
    }
  };
  //Form edit
  const renderFormEdit = (messId: string) => {
    return (
      <form
        noValidate
        onSubmit={handleSubmit(editMessage)}
        className={`${isEdtting ? `isEditting-message-${roomId}` : "hidden"} w-full p-2 bg-blue-light rounded-md`}
      >
        <Textarea
          {...register("content")}
          onChange={(e) => onTyping(e.currentTarget.value)}
          onKeyDown={(e) => handleOnEnter(e, messId)}
          placeholder={t("Aa")}
          classNames={{
            root: "flex-grow mb-2",
          }}
          id={`txt-reply-${messId}`}
        />
        <div className="flex items-center justify-end">
          <Button onClick={() => cancelEdit()} variant="outline" size="xs" className={"h-10"}>
            <Icon name="close" />
          </Button>
          <Button
            id={`button-reply-${messId}`}
            disabled={isDisableEdit}
            type="submit"
            size="xs"
            className={"ml-2 h-10"}
          >
            <Icon name="done" />
          </Button>
        </div>
      </form>
    );
  };

  return <>{renderTemplate()}</>;
};

export default OnlyMessageTemplate;
