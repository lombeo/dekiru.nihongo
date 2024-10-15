import Icon from "@edn/font-icons/icon";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { ChatChanelEnum } from "@chatbox/constants";
import { ChatBoxHelper } from "@chatbox/helper/functions-base.helper";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { selectProfile } from "@src/store/slices/authSlice";
import { useSelector } from "react-redux";

/**
 * Template reply area
 * @returns Reply template
 */
const ReplyArea = (props: any) => {
  const roomId = props.roomId;
  const { t } = useTranslation();
  const profile = useSelector(selectProfile);
  const [isShowReplyArea, setIsShowReplyArea] = useState(false);
  const [replyUsername, setReplyUsername] = useState("");
  const [contentReply, setContentReply] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    const replyAction = PubSub.subscribe(ChatChanelEnum.REPLY_ACTION, (chanel, { data, roomId }) => {
      if (props.roomId != roomId) {
        return;
      }
      setIsShowReplyArea(false);
      const uid = new Date().toString();
      setId(uid);
      const userName = data?.senderId == profile?.userId ? t("yourself") : data?.sender?.username;
      const type = data?.data?.type;
      //Template file reply content
      let file = data?.data?.url;
      let contentFile = t("Attachment file");
      if (file.length > 0) {
        if (FunctionBase.isJsonString(file[0])) {
          if (JSON.parse(file[0]).type == "image") {
            contentFile = t("Image");
          } else if (JSON.parse(file[0]).type == "video") {
            contentFile = t("Video");
          } else if (JSON.parse(file[0]).type == "file") {
            contentFile = t("Attachment file");
          }
        } else {
          if (file[0].type == "image") {
            contentFile = t("Image");
          } else if (file[0].type == "video") {
            contentFile = t("Video");
          } else if (file[0].type == "file") {
            contentFile = t("Attachment file");
          }
        }
      }
      let content = type == "ATTACHMENT" ? contentFile : data?.data?.text;
      if (userName != "") {
        setIsShowReplyArea(true);
        setReplyUsername(userName);
        setContentReply(content);
        let files = data?.data?.url;
        const replyObject = {
          id: data?.id,
          text: FunctionBase.htmlDecode(data?.data?.text),
          url: files,
          type: files.length > 0 ? "ATTACHMENT" : "MESSAGE",
          userId: data?.sender?.id,
          userName: data?.sender?.username,
        };
        setTimeout(function () {
          let dom_reply = document.getElementsByClassName(`reply-message-${uid}`)[0];
          if (dom_reply != null) {
            dom_reply.setAttribute("data-reply-object", ChatBoxHelper.encodeSingleQuote(JSON.stringify(replyObject)));
          }
        }, 100);
      }
    });
    return () => {
      PubSub.unsubscribe(replyAction);
    };
  }, []);

  return (
    <div
      id={`reply-area-${roomId}`}
      className={`border-t-slate-200 border-t px-3 py-1 text-sm pr-6 relative reply-message-${id} ${
        isShowReplyArea ? "" : "hidden"
      }`}
    >
      <span
        title={t("Remove")}
        className="flex items-center justify-center cursor-pointer absolute top-1 right-1 hover:text-red"
        onClick={() => setIsShowReplyArea(false)}
      >
        <Icon name="close" />
      </span>
      <div className="whitespace-nowrap overflow-hidden overflow-ellipsis">
        <span>{t("Replying to")} </span>
        <strong title={replyUsername}>{replyUsername}</strong>
      </div>
      <div
        className="whitespace-nowrap overflow-hidden overflow-ellipsis text-gray-500"
        title={FunctionBase.escapeForTitleAttribute(FunctionBase.htmlDecode(contentReply))}
      >
        {FunctionBase.htmlDecode(contentReply)}
      </div>
    </div>
  );
};

export default ReplyArea;
