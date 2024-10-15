import moment from "moment";
import { COMMON_FORMAT } from "../config/constants/common-format";
import _, { isNil } from "lodash";

export const DateTimeHelper = {
  formatDateTime: (date: any, formatType: COMMON_FORMAT = COMMON_FORMAT.TIME_DATE) => {
    if (!date) return "";
    return moment(new Date(date)).format(formatType);
  },
  formatDate: (dateString, checkHour = 0) => {
    if (!dateString) return "";
    let format = "DD/MM/YYYY";
    if (checkHour == 0) {
      format = "HH:mm DD/MM/YYYY";
    }
    return moment.utc(dateString).zone("+0700").format(format);
  },
  timeCompare: (a: any, b: any) => {
    let _ATime = moment.utc(a).valueOf();
    let _BTime = moment.utc(b).valueOf();

    var diff = _ATime - _BTime;

    if (diff == 0) return diff;
    if (diff < 0) return -1;
    if (diff > 0) return 1;
  },
  timeCompareTZ: (a: any, b: any) => {
    let _ATime = moment.utc(a).zone("+0700").valueOf();
    let _BTime = moment.utc(b).zone("+0700").valueOf();

    var diff = _ATime - _BTime;

    if (diff == 0) return diff;
    if (diff < 0) return -1;
    if (diff > 0) return 1;
  },
};

export const secondToHHMMSS = (sec_num: number) => {
  if (isNil(sec_num)) return null;
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor((sec_num - hours * 3600) / 60);

  const hoursStr = _.padStart(_.toString(hours), 2, "0");
  const minutesStr = _.padStart(_.toString(Math.floor((sec_num - Math.floor(sec_num / 3600) * 3600) / 60)), 2, "0");
  const seconds = _.padStart(_.toString(sec_num - hours * 3600 - minutes * 60), 2, "0");

  return `${hoursStr}:${minutesStr}:${seconds}`;
};

export const millisecondsToSecond = (milliseconds: number) => {
  if (isNil(milliseconds)) return 0;
  return Math.ceil(milliseconds / 10) / 100;
};
