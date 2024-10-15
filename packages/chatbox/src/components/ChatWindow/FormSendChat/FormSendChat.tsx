import { ChatChanelEnum } from "@chatbox/constants";
import { ChatBoxHelper } from "@chatbox/helper/functions-base.helper";
import { updateLastActiveTimeWindow, useSendMessage } from "@chatbox/hook/useChatSocket";
import { useSeenNotifyChat } from "@chatbox/hook/useSeenNotifyChat";
import { OverlayLoading, Visible } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { Button, Textarea } from "@mantine/core";
import PaperPlane from "@src/components/Svgr/components/PaperPlane";
import { CHATGPT_ID } from "@src/config";
import { PubsubTopic, fileType } from "@src/constants/common.constant";
import recaptcha from "@src/helpers/recaptcha.helper";
import { getAnonymousUser } from "@src/hooks/useJwtToken";
import { FriendService } from "@src/services/FriendService/FriendService";
import { UploadService } from "@src/services/UploadService/UploadService";
import { selectProfile } from "@src/store/slices/authSlice";
import clsx from "clsx";
import DOMPurify from "isomorphic-dompurify";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useSelector } from "react-redux";
import ChatUploadArea from "../ChatUploadArea";
import styles from "./FormSendChat.module.scss";

const MAX_SIZE_UPLOAD = `${process.env.NEXT_PUBLIC_MAX_SIZE_UPLOAD_FILE}`;

const FormSendChat = (props: any) => {
  const { roomId, isActive = true, data, reConnect } = props;
  const { t } = useTranslation();

  const profile = useSelector(selectProfile);
  const [listFile, setListFile] = useState([]);
  const [isLoadingUploadFile, setIsLoadingUploadFile] = useState(false);
  const [isUserAdded, setIsUserAdded] = useState(false);
  const { markSeenNotifyChat } = useSeenNotifyChat();
  const [content, setContent] = useState("");
  const isChatGPT = data.friend?.id === CHATGPT_ID;
  const { sendMessage } = useSendMessage();

  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    PubSub.subscribe(ChatChanelEnum.REPLY_ACTION, (chanel, { data, roomId }) => {
      if (data?.id && data?.id != "") {
        const txt = document.getElementById(`txt-smg-${roomId}`);
        if (txt != null) {
          txt.focus();
        }
      }
    });
    let useradd = PubSub.subscribe(ChatChanelEnum.USER_ADD, (chanel, { room_Id }) => {
      if (room_Id == roomId) {
        setIsUserAdded(true);
      }
    });
    return () => {
      PubSub.unsubscribe(useradd);
    };
  }, []);

  useEffect(() => {
    //Drag drop handle
    if (isChatGPT) return;
    const target = document.getElementById(`chatbox-${roomId}`);
    if (target != null) {
      target.addEventListener("dragover", (event) => {
        event.preventDefault();
        event.stopPropagation();
        target.style.border = "2px dashed gray";
      });

      target.addEventListener("dragleave", (event) => {
        event.preventDefault();
        event.stopPropagation();
        target.style.border = "unset";
      });

      target.addEventListener("drop", (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        let files = event.dataTransfer.files;
        onChangeUploadfile(files);
        target.style.border = "unset";
      });
    }
  }, []);

  //Handle submit
  const onSubmitMessage = () => {
    let id = roomId;
    let files = listFile;

    if (window?.navigator && !window.navigator.onLine) {
      Notify.warning(t("Internet connection is interrupted. Please try again!"));
      PubSub.publish(PubsubTopic.CONNECT_CHAT_SOCKET);
      return;
    }

    if (!((!!content.length && !!content.replace(/\s/g, "").length) || files.length > 0)) {
      return;
    }
    let isPrivate = true;
    let replyObject = null;
    let dom_reply = document.getElementById(`reply-area-${roomId}`);
    if (dom_reply != null && !dom_reply.classList.contains("hidden")) {
      replyObject = dom_reply.getAttribute("data-reply-object");
    }

    const anonymousUser = getAnonymousUser();
    const currentUserId = profile ? profile?.userId : anonymousUser?.userId;

    if (!currentUserId) return;

    let wrapMessage = ChatBoxHelper.MessageData(null, "TEXT", content, files, replyObject, isPrivate, currentUserId);

    sendMessage(
      id,
      wrapMessage,
      () => {
        if (dom_reply != null) {
          dom_reply.classList.add("hidden");
        }
        setContent("");
        setListFile([]);
        scrollChat();
      },
      () => {
        reConnect?.();
      }
    );

    if (isChatGPT) {
      PubSub.publish(ChatChanelEnum.CHAT_GPT_LOADING, true);
      FriendService.chatPushMessage({
        userId: profile?.userId,
        message: DOMPurify.sanitize(content, { ALLOWED_TAGS: ["#text"] }),
      })
        .then((res) => {
          if (res?.data?.message) {
            Notify.error(t(res.data.message));
          }
        })
        .finally(() => {
          scrollChat();
          PubSub.publish(ChatChanelEnum.CHAT_GPT_LOADING, false);
        });
    }
  };

  const scrollChat = () => {
    setTimeout(function () {
      let detailChat = document.getElementById(`detail-chat-${roomId}`);
      if (detailChat != null) {
        //Position from top to scroll
        let positionTop = detailChat.scrollTop;
        //Total height
        let totalHeight = detailChat.scrollHeight - detailChat.clientHeight;
        if (totalHeight - positionTop > 20) {
          detailChat.scrollTo(0, detailChat.scrollHeight);
        }
      }
    }, 300);
  };

  const enabledSend = (listFile.length > 0 || content.length > 0) && isActive;

  const handleOnEnter = (e: any) => {
    updateLastActiveTimeWindow(roomId);
    if (e.keyCode == 13) {
      if (e.shiftKey) {
        return;
      }
      e.preventDefault();
      e.currentTarget.focus();
      if (enabledSend) {
        onSubmitMessage();
      }
    }
  };

  const handleClickSend = () => {
    document.getElementById(`txt-smg-${roomId}`).focus();
    if (enabledSend) {
      onSubmitMessage();
    }
  };

  //Update file
  const onChangeUploadfile = async (values: any) => {
    updateLastActiveTimeWindow(roomId);
    if (values != null) {
      let files = Object.values(values);
      if (files.length > 0) {
        let isValid = validateFiles(files, "upload");
        if (!isValid) {
          return;
        }
        setIsLoadingUploadFile(true);
        for (const file of files) {
          let _file: any = file;
          let fileName = _file?.name;
          let fileTypeRequest = convertFileType(fileName);
          if (!executeRecaptcha) {
            console.log(t("Execute recaptcha not yet available"));
            return;
          }
          recaptcha.show();
          executeRecaptcha("enquiryFormSubmit")
            .then(async (gReCaptchaToken) => {
              recaptcha.hidden();
              const uploadRes = await UploadService.upload(_file, fileType.supportAttach, gReCaptchaToken);
              if (uploadRes?.data?.success) {
                setListFile((prev) => {
                  return [
                    ...prev,
                    {
                      name: fileName,
                      type: fileTypeRequest,
                      url: uploadRes?.data?.data?.url,
                    },
                  ];
                });
                //After Upload all, enable input file and button send chat
                setIsLoadingUploadFile(false);
                //Focus after Upload
                const txt = document.getElementById(`txt-smg-${roomId}`);
                if (txt != null) {
                  txt.focus();
                }
              } else {
                if (uploadRes?.data?.message) {
                  Notify.error(t(uploadRes?.data?.message));
                }
              }
            })
            .catch(() => {
              recaptcha.hidden();
            });
        }
      }
    }
  };

  const notValieFileType = (fileName: string) => {
    const validTypes = ["png", "jpg", "jpeg", "gif", "bmp"];
    let strings = fileName.split(".");
    let type = strings[strings.length - 1].toLocaleLowerCase();
    return !validTypes.includes(type);
  };

  //Validate files
  const validateFiles = (files: any, context = "upload") => {
    let isValid = true;
    let _files = [];
    if (context == "paste") {
      //Push convert file to _files
      for (const file of files) {
        if (file?.kind != "file") {
          continue;
        }
        let _file: any = file.getAsFile();
        _files.push(_file);
      }
    } else if (context == "upload") {
      _files = files;
    }
    if (_files.some((item: any) => item?.name.length > 100)) {
      Notify.error(t("The entire file name must not exceed 100 characters"));
      isValid = false;
    } else if (_files.some((item: any) => item?.size > parseInt(MAX_SIZE_UPLOAD) * 1024 * 1024)) {
      Notify.error(t("Upload file size must not exceed ") + MAX_SIZE_UPLOAD + "Mb");
      isValid = false;
    } else if (_files.some((item: any) => notValieFileType(item?.name))) {
      Notify.error(t("Invalid uploaded file. The system supports files in .png,.jpg,.jpeg,.gif,.bmp"));
      isValid = false;
    }
    if (!isValid) {
      const inputFile: any = document.getElementById(`edn-cb-mediaCapture-${roomId}`);
      if (inputFile != null) {
        inputFile.value = "";
      }
    }
    return isValid;
  };

  const convertFileType = (fileName: string) => {
    if (/\.(ppt|pptx|doc|docx|xlsx|xls|pdf|rar|7z)$/i.test(fileName)) {
      return "file";
    } else if (/\.(mp4|mov|avi|wmv|m4v)$/i.test(fileName)) {
      return "video";
    } else if (/\.(jpe?g|png|gif|bmp)$/i.test(fileName)) {
      return "image";
    }
  };

  //On remove file
  const onRemoveFile = (idx: number) => {
    let arr = [...listFile];
    arr.splice(idx, 1);
    setListFile(arr);
  };

  //Handle focus to text box
  const onFocusToTextBox = () => {
    updateLastActiveTimeWindow(roomId);
    //Mark seen
    markSeenNotifyChat(data.id);
  };

  useEffect(() => {
    const onOnline = function () {
      console.log("I am connected to the internet");
      reConnect?.();
    };
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("online", onOnline);
    };
  }, []);

  //Paste handle
  const onPasteMessage = (ev: any) => {
    if (isChatGPT) return;
    updateLastActiveTimeWindow(roomId);
    //Paste handle
    let clipboardData = (ev.clipboardData || ev.originalEvent.clipboardData).items;
    let totalFile = clipboardData.length;
    if (totalFile < 1) {
      return;
    }
    let isValid = validateFiles(clipboardData, "paste");
    if (isValid) {
      onPasteUploadFiles(clipboardData);
    }
  };

  //On paste Upload file
  const onPasteUploadFiles = async (clipboardData: any) => {
    if (clipboardData != null) {
      // Promise to Upload list files
      const promises: any[] = [];
      const forloop = () => {
        for (const file of clipboardData) {
          if (file?.kind != "file") {
            continue;
          }
          setIsLoadingUploadFile(true);
          let _file: any = file.getAsFile();
          let fileName = _file?.name;
          let fileTypeRequest = convertFileType(fileName);
          if (!executeRecaptcha) {
            console.log(t("Execute recaptcha not yet available"));
            return;
          }
          executeRecaptcha("enquiryFormSubmit").then(async (gReCaptchaToken) => {
            const promise = UploadService.upload(_file, fileType.supportAttach, gReCaptchaToken).then(
              (uploadRes: any) => {
                if (uploadRes?.data?.success) {
                  listFile.push({
                    name: fileName,
                    type: fileTypeRequest,
                    url: uploadRes?.data?.data?.url,
                  });
                  setListFile([...listFile]);
                } else {
                  if (uploadRes?.data?.message && uploadRes?.data?.message != null && uploadRes?.data?.message != "") {
                    Notify.error(t(uploadRes?.data?.message));
                  }
                }
                return uploadRes;
              }
            );
            promises.push(promise);
          });
        }
      };
      forloop();
      Promise.all(promises).then((res: any) => {
        setIsLoadingUploadFile(false);
        //Focus after Upload
        const txt = document.getElementById(`txt-smg-${roomId}`);
        if (txt != null) {
          txt.focus();
        }
      });
    }
  };
  return (
    <>
      <div
        className={clsx("form-send bottom-0", styles.formSendChat, {
          "cursor-not-allowed": !isActive,
        })}
      >
        <div className={`message-form relative rounded-sm`}>
          {!isChatGPT && <ChatUploadArea roomId={roomId} onRemoveFile={onRemoveFile} listFile={listFile} />}
          <div className="flex gap-2 items-center">
            {!isChatGPT && (
              <div className="uploadFile flex items-center w-8">
                <Visible visible={isLoadingUploadFile}>
                  <div className="w-5 h-5">
                    <OverlayLoading size="20"></OverlayLoading>
                  </div>
                </Visible>
                <Visible visible={!isLoadingUploadFile}>
                  <span
                    id={`chat-upload-btn-${roomId}`}
                    className="inline-flex items-center justify-center chat-btn min-w-8 w-6 h-8"
                  >
                    <label
                      htmlFor={`edn-cb-mediaCapture-${roomId}`}
                      className={`la la-paperclip flex items-center justify-center ${
                        isActive ? "cursor-pointer" : "opacity-40 cursor-not-allowed"
                      }`}
                    >
                      <Icon name="paper-clip" className="text-[#65656D]" size={20} />
                    </label>
                    <input
                      onChange={(e) => onChangeUploadfile(e.currentTarget.files)}
                      id={`edn-cb-mediaCapture-${roomId}`}
                      name="edn-cb-mediaCapture"
                      className="input-upload-file-chat hidden"
                      type="file"
                      disabled={!isActive}
                      accept=".png,.jpg,.jpeg,.gif,.bmp"
                      multiple={true}
                    />
                  </span>
                </Visible>
              </div>
            )}
            <div className="w-full relative" onClick={() => !isActive && onFocusToTextBox()}>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => handleOnEnter(e)}
                onPaste={(e) => onPasteMessage(e)}
                onClick={() => onFocusToTextBox()}
                placeholder={t("Aa")}
                classNames={{
                  root: "flex-grow w-full",
                  input: "bg-gray-lighter border border-[#ccc] py-2 rounded-xl",
                }}
                radius="lg"
                autoFocus={!isActive}
                disabled={!isActive}
                autosize
                minRows={1}
                maxRows={4}
                id={`txt-smg-${roomId}`}
              />
            </div>
            <Button
              className="submit !bg-transparent text-[#111] chat-btn w-6 p-0 h-10 inline-flex items-center justify-center"
              type="submit"
              disabled={!enabledSend}
              title={t("Send")}
              onClick={handleClickSend}
            >
              <PaperPlane height={22} width={22} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default FormSendChat;
