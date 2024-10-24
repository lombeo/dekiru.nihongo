export const APP_TITLE = "Dekiru";
export const APP_DESCRIPTION = "Social Constructive Learning Platform";

export const EMAIL_PATTERN =
  /^(?!\.)("(^""\r\\]|\\[""\r\\])*""|([-a-z0-9!#$%&'*+/=?^_`{|}~]|(?<!\.)\.)*)(?<!\.)@[a-z0-9][\w\.-]*[a-z0-9]\.[a-z][a-z\.]*[a-z]$/i;

export enum FORM_ACTION_CONSTANT {
  DEFAULT_CREATE_PARAM = "create",
}

export enum LOCAL_STORAGE {
  TOKEN = "ACCESS_TOKEN",
  CHAT_TOKEN = "CHAT_TOKEN",
  CART_ITEMS = "CART_ITEMS",
  FIRST_TIME_LOAD_EVENT = "FIRST_TIME_LOAD_EVENT"
}

export enum COOKIES_NAME {
  CHAT_ANONYMOUS_TOKEN = "CHAT_ANONYMOUS_TOKEN",
  ORDER_INFO = "ORDER_INFO",
}

export enum PubsubTopic {
  OPEN_CONFIRMATION_MODAL = "OPEN_CONFIRMATION_MODAL",
  NOTIFICATION = "NOTIFICATION",
  ENROLL_COUNT_LENGTH = "ENROLL_COUNT_LENGTH",
  OPEN_SEARCH_HEADER = "OPEN_SEARCH_HEADER",
  NOTIFY_CLICK_OUTSIDE = "NOTIFY_CLICK_OUTSIDE",
  ALREADY_ENROLL = "ALREADY_ENROLL",
  CHANGE_ANSWER = "CHANGE_ANSWER",
  SET_COURSE_DETAIL = "SET_COURSE_DETAIL",
  SET_ACTIVITY_CODE_CONTEXT = "SET_ACTIVITY_CODE_CONTEXT",
  UPDATE_SUMMARY_HOME = "UPDATE_SUMMARY_HOME",
  HOME_SHOW_TOUR = "HOME_SHOW_TOUR",
  CONNECT_CHAT_SOCKET = "CONNECT_CHAT_SOCKET",
  UPDATE_USER_PROFILE = "UPDATE_USER_PROFILE",
}

export enum NotificationLevel {
  INFO = "INFO",
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

export const DEFAULT_AVATAR_URL = "/images/user-default.svg";
export const DEFAULT_FRAME_AVATAR_URL = "/images/avatar/User-01.png";

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
  supportAttach: 10,
};

export const QUIZ_CONSTANT = {
  TYPE_RANDOM: 0,
  TYPE_FIXED: 1,
};

export const QUIZ_LAYOUT = {
  EVERY_QUESTION: 0,
  EACH_QUESTION: 1,
};

export const maxTimeLimit = 999999999;

export enum ActivityTypeEnum {
  All = 0,
  Reading = 1,
  CQ = 2,
  Video = 3,
  Question = 4,
  File = 5,
  Lesson = 6,
  Assignment = 7,
  Quiz = 8,
  Feedback = 9,
  Group = 10,
  Poll = 11,
  Code = 12,
  Scorm = 13,
  Scratch = 14,
}

export const Order = {
  createOn: 0,
  name: 1,
};
export enum TimeUnitEnum {
  Minutes = 1,
  Hours = 2,
  Days = 3,
  Weeks = 4,
}

export enum ViewScop {
  student = 0,
  teacher = 1,
  admin = 2,
}

export const REGEX_PHONE = /(^[0-9\-\+]{1})+([0-9]{9,12})$/g;

export enum OauthProviderEnum {
  Dekiru = 0,
  Google = 1,
  GitHub = 2,
  Microsoft = 3,
}
