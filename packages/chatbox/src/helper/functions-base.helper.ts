import { FunctionBase } from "@src/helpers/fuction-base.helpers";

interface MessageContentProps {
  text: string;
  url: any;
  type: any;
  replyObject: any;
}
interface MessageProps {
  replyMessageId: string;
  type: any;
  data: any;
  tagList: any;
  privateChat: boolean;
}
interface WrapMessageProps {
  id: string;
  clientKey: any;
  message: any;
}

export const ChatBoxHelper = {
  /**
   * Encode single quote
   * @param text
   * @returns String with encoding single quote text
   */
  encodeSingleQuote: function (text: string) {
    return text?.replaceAll("'", "&apos;");
  },
  /**
   * Decode single quote
   * @param text
   * @returns String with readable double quote text
   */
  decodeQuote: function (text: string) {
    return text?.replaceAll("&quot;", '"');
  },

  /*
   * id: messageId
   * type: TEXT || ATTACHMENT || EDIT_MESSAGE || DELETE_MESSAGE || REACTION
   * isPrivate is bool
   */

  MessageData: function (messageId, type, content, files, replyObject, isPrivate = true, userId) {
    //Define content of message;
    let wrapMessage: WrapMessageProps = {
      id: "",
      clientKey: "",
      message: "",
    };
    let message: MessageProps = {
      replyMessageId: "",
      type: "",
      data: "",
      tagList: [],
      privateChat: true,
    };
    let messageContent: MessageContentProps = {
      text: "",
      url: [],
      type: "",
      replyObject: null,
    };

    if (type != "DELETE_MESSAGE" && type != "REACTION") {
      messageContent.text = FunctionBase.htmlEncode(content);
      messageContent.url = files;
      messageContent.type = files != "" ? "ATTACHMENT" : "MESSAGE";
      messageContent.replyObject = replyObject;
      //Add replyId case reply
      if (replyObject != null) {
        message.replyMessageId = JSON.parse(replyObject).id;
      }
    } else {
      messageContent = content;
    }
    //Add to Message model for send message
    message.privateChat = isPrivate;
    message.type = type;
    message.data = messageContent;
    message.tagList = null;
    //Add data to model for send message.
    wrapMessage.id = messageId;
    wrapMessage.clientKey = userId + "-" + new Date().toISOString();
    wrapMessage.message = message;
    return wrapMessage;
  },
  //Normally url to link
  Linkify: function (inputText) {
    if (inputText === null || inputText === undefined) {
      return "";
    }

    let replacedText, replacePattern1, replacePattern2, replacePattern3;

    // URLs starting with http://, https://, ftp:// or file://
    replacePattern1 = /(\b(https?|ftp|file):\/\/[-A-ZÄÖÅ0-9+&@#\/%?=~_|!:,.;]*[-A-ZÄÖÅ0-9+&@#\/%=~_|])/gim;

    replacedText = inputText.replace(replacePattern1, function (txt, value) {
      try {
        let domain = new URL(value);
        if (!/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(domain.hostname)) {
          return '<a href="' + txt + '" target="_blank">' + txt + "</a>";
        } else {
          return txt;
        }
      } catch (err) {
        return txt;
      }
    });

    // URLs starting with "www." (without // before it, or it would re-link the ones done above).
    replacePattern2 = /(^|[^\/f])(www\.[-A-ZÄÖÅ0-9+&@#\/%?=~_|!:,.;]*[-A-ZÄÖÅ0-9+&@#\/%=~_|])/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="https://$2" target="_blank">$2</a>');

    // Change email addresses to mailto: links.
    replacePattern3 = /(([A-ZÄÖÅ0-9\-\_\.])+@[A-ZÄÖÅ\_]+?(\.[A-ZÄÖÅ]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1" target="_blank">$1</a>');

    // If there are hrefs in the original text, let's split
    // the text up and only work on the parts that don't have urls yet.
    var count = inputText.match(/<a href/g) || [];

    if (count.length > 0) {
      // Keep delimiter when splitting
      var splitInput = inputText.split(/(<\/a>)/g);
      for (var i = 0; i < splitInput.length; i++) {
        if (splitInput[i].match(/<a href/g) == null) {
          splitInput[i] = splitInput[i]
            .replace(replacePattern1, '<a href="$1" target="_blank">$1</a>')
            .replace(replacePattern2, '$1<a href="https://$2" target="_blank">$2</a>')
            .replace(replacePattern3, '<a href="mailto:$1" target="_blank">$1</a>');
        }
      }
      return splitInput.join("");
    } else {
      return replacedText;
    }
  },
  /**
   *
   * @param roomId id of chat room
   * @returns is show confirm close chatbox
   */
  checkConfirmCloseChatbox: function (roomId: string) {
    let isShowConfirm = false;
    //Check text box has content
    const txt: any = document.getElementById(`txt-smg-${roomId}`);
    if (txt != null) {
      let text = txt.value.trim();
      if (text.length > 0) {
        isShowConfirm = true;
      }
    }
    //Check Upload file has content
    const files: any = document.getElementById(`list-file-upload-${roomId}`);
    if (files != null) {
      if (files.hasChildNodes()) {
        isShowConfirm = true;
      }
    }
    //Check has any editting message
    const formEditMessage: any = document.getElementsByClassName(`isEditting-message-${roomId}`);
    if (formEditMessage != null && formEditMessage.length > 0) {
      isShowConfirm = true;
    }
    return isShowConfirm;
  },
  /**
   *
   * @param roomId id of chat room
   * @returns is chatbox has content typing
   */
  hasContentIsTyping: function (roomId: string) {
    let hasContent = false;
    //Check text box has content
    const txt: any = document.getElementById(`txt-smg-${roomId}`);
    if (txt != null) {
      let text = txt.value.trim();
      if (text.length > 0) {
        hasContent = true;
      }
    }
    //Check Upload file has content
    const files: any = document.getElementById(`list-file-upload-${roomId}`);
    if (files != null) {
      if (files.hasChildNodes()) {
        hasContent = true;
      }
    }
    return hasContent;
  },
};
