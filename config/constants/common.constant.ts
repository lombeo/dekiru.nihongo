export enum FORM_ACTION_CONSTANT {
  DEFAULT_CREATE_PARAM = "create",
}
export enum PubsubTopic {
  ACTIVITY_CHANGED = "ACTIVITY_CHANGED",
  OPEN_CONFIRMATION_MODAL = "OPEN_CONFIRMATION_MODAL",
  NOTIFICATION = "NOTIFICATION",
  API_ERROR = "API_HTTP_STATUS_NOT_SUCCESS",
  QUESTIONBANK_CHANGED = "QUESTIONBANK_CHANGED",
  QUESTIONLIST_CHANGED = "QUESTIONLIST_CHANGED",
  FORCE_LOGIN = "FORCE_LOGIN",
  PREVIEW_ACTIVITY = "PREVIEW_ACTIVITY",
  COURSE_UPDATE_SECTION_SESSION = "COURSE_UPDATE_SECTION_SESSION",
  COURSE_SYNC_UPDATED = "COURSE_SYNC_UPDATED",
  QUIZ_SUMMARY = "QUIZ_SUMMARY",
  SUBMIT_CODE = "SUBMIT_CODE",
  SHARE = "SHARE",
}

export enum NotificationLevel {
  INFO = "INFO",
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
  ERROR = "ERROR",
}
export enum TypeMenuBar {
  UserManagement,
  SystemManagement,
}
export const fileState = {
  Folder: 1,
  File: 2,
};
export const fileExtension = {
  Image: "image",
  Word: "doc",
  Excel: "xls",
  PowerPoint: "ppt",
  Pdf: "pdf",
  Document: "doc,xls,pdf,ppt",
  Video: "video",
  Audio: "audio",
  Media: "video,audio",
  MultiMedia: "video,audio,image",
  Zip: "zip",
  Files: "video,audio,image,zip",
  Other: "other",
};

export const fileType = {
  imagesComment: 0,
  attFileComment: 1,
  attVideoComment: 2,
  attachFileChat: 3,
  attachImgContent: 4,
  attachVideoContent: 5,
  attachFileContent: 6,
  thumbnailContent: 7,
  assignmentAttach: 9,
  scratchAttach: 12,
};

export const QUIZ_CONSTANT = {
  TYPE_RANDOM: 0,
  TYPE_FIXED: 1,
};

export const VIETNAM_COUNTRY_ID = process.env.NEXT_PUBLIC_ID_COUNTRY_VIETNAM;
export const ID_HELP_TRAINING = process.env.NEXT_PUBLIC_ID_HELP_TRAINING;
export const ID_HELP_FIGHTS = process.env.NEXT_PUBLIC_ID_HELP_FIGHTS;
export const ID_HELP_PAYMENT_INSTRUCTIONS = process.env.NEXT_PUBLIC_ID_HELP_PAYMENT_INSTRUCTIONS;
export const ID_HELP_GENERAL_TRANSACTION = process.env.NEXT_PUBLIC_ID_HELP_GENERAL_TRANSACTION;
export const ID_HELP_SERVICE_USAGE = process.env.NEXT_PUBLIC_ID_HELP_SERVICE_USAGE;
export const ID_HELP_WARRANTY_POLICY = process.env.NEXT_PUBLIC_ID_HELP_WARRANTY_POLICY;
export const ID_HELP_RETURN_POLICY = process.env.NEXT_PUBLIC_ID_HELP_RETURN_POLICY;
export const ID_HELP_PRIVACY_POLICY = process.env.NEXT_PUBLIC_ID_HELP_PRIVACY_POLICY;
