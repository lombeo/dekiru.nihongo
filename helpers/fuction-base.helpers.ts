import { EMAIL_PATTERN } from "@src/constants/common.constant";
import { LocaleKeys } from "@src/public/locales/locale";
import _, { isEmpty, isNil, isString } from "lodash";
import moment from "moment";
import { i18n } from "next-i18next";
import { COMMON_FORMAT } from "../config/constants/common-format"; //Interface for formatDateGMT

//Interface for formatDateGMT
interface FormatDateProp {
  dateString: string;
  checkHour?: boolean;
  timeZoneNumber?: number;
}
export const FunctionBase = {
  downloadPNG: async (data: any, fileName = "file") => {
    try {
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {}
  },
  downloadSvgToPNG: (svgData: any, fileName = "file") => {
    try {
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.src = url;
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        canvas.width = 1700;
        canvas.height = (1700 / img.width) * img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, "image/png");
      };
    } catch (e) {}
  },
  getFormattedDate: (date: any) => {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return day + "-" + month + "-" + year;
  },
  convertMsToTime: (milliseconds: any) => {
    const padTo2Digits = (num: any) => {
      return num.toString().padStart(2, "0");
    };
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
  },
  getSelectOptions: (
    data: any,
    defaultValue: boolean = true,
    valueField: string = "id",
    labelField: string = "name",
    subject: string = ""
  ) => {
    if (!data) return [];
    let rawOptions = data;

    if (defaultValue) {
      const tempOptions = [
        {
          [valueField]: "",
          [labelField]: `${i18n?.t(LocaleKeys.All)} ${subject}`,
        },
      ];
      rawOptions = [...tempOptions, ...rawOptions];
    }
    return rawOptions?.map((x: any) => {
      return {
        value: x[valueField]?.toString(),
        label: x[labelField]?.toString(),
      };
    });
  },
  normallyMessageWithParams: (message: string) => {
    let params: string[] = [];
    //temp: Message||Value1||Value2
    let messArr = message.split("||");
    if (messArr.length > 1) {
      message = messArr[0];
      messArr.shift();
      params = messArr;
    }
    message = i18n?.t(message) || "";
    if (params.length > 0) {
      params.forEach((item, index) => {
        message = message.replace(new RegExp("\\{" + index + "\\}", "g"), function () {
          return item;
        });
      });
    }
    return message;
  },
  parseJwt: (token) => {
    try {
      if (!token) return null;
      const base64Url = token?.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.log(e);
    }
    return null;
  },
  getCourseEnrollLimitStringCourse: (enrollLimit: number | null | undefined) => {
    switch (enrollLimit) {
      case 1:
        return "Public";
      case 0:
        return "Private";
      default:
        return "";
    }
  },
  getCourseViewLimitStringCourse: (viewLimit: number | null | undefined) => {
    switch (viewLimit) {
      case 1:
        return "Public";
      case 0:
        return "Private";
      default:
        return "";
    }
  },
  getViewLimit: (viewLimitStr: string | null | undefined) => {
    switch (viewLimitStr) {
      case "Public":
        return 1;
      case "Private":
        return 0;
      case "Share":
        return 0;
      default:
        return 1;
    }
  },
  getEnrollLimit: (enrollLimitStr: string | null | undefined) => {
    console.log(enrollLimitStr);
    switch (enrollLimitStr) {
      case "Public":
        return 1;
      case "Private":
        return 0;
      case "Share":
        return 1;
      default:
        return 1;
    }
  },
  /**
   * @deprecated The method should not be used
   */
  formatDateGMT: function (prop: FormatDateProp) {
    const { dateString, checkHour = true, timeZoneNumber = 7 } = prop;
    if (!dateString) return "";
    let format = "DD/MM/YYYY";
    if (checkHour) {
      format = "HH:mm DD/MM/YYYY";
    }
    let zoneNum = `+0${timeZoneNumber}00`;
    return moment.utc(dateString).utcOffset(zoneNum).format(format);
  },
  formatDate: (date: any, format: COMMON_FORMAT = COMMON_FORMAT.DATE) => {
    if (!date) return "";
    return moment(new Date(date)).format(format);
  },
  formatNumber: (num: any, config?: any) => {
    if (typeof num === "undefined") return num;
    return new Intl.NumberFormat("vi-VN", config).format(num);
  },
  formatShortPrice: (num: any) => {
    if (typeof num === "undefined") return num;
    if (num >= 1000000) {
      let millions = Math.floor(num / 1000000);
      let remainder = Math.round((num % 1000000) / 100000);
      return remainder > 0 ? `${millions}tr${remainder}` : `${millions}tr`;
    } else if (num >= 1000) {
      return Math.round(num / 1000) + "k";
    } else {
      return num.toString();
    }
  },
  formatPrice: (num: any) => {
    if (typeof num === "undefined") return num;
    return new Intl.NumberFormat("vi-VN").format(num) + " đ";
  },
  unique: (item: any, index: any, array: any) => {
    return array.indexOf(item) == index;
  },
  normalizeSpace: (value: string, allSpace?: false) => {
    if (allSpace) {
      return value.trim().replace(/\s\s+/g, " ");
    }
    return value && value.trim().replace(/( {2})+/g, " ");
  },
  getParameterByName: (name: string, _url?: string) => {
    let url = _url;
    if (typeof window !== "undefined" && isEmpty(_url)) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  },
  /**
   * Return string with encode quote to string for display in title.
   * @param input
   * @returns string and convert quote to string.
   */
  escapeForTitleAttribute(input: string) {
    input = input + "";
    return input.replaceAll('"', "&quot;");
  },
  /**
   * Encode HTML
   * @param input string html
   * @returns string with html encode
   */
  htmlEncode(input: string) {
    if (input === undefined) return "";
    return this.escape(input);
  },
  //HTML Decode
  htmlDecode(input: string) {
    if (isNil(input)) return "";
    const e = document.createElement("textarea");
    e.innerHTML = input;
    // handle case of empty input
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  },
  /**
   * Remove all html tag and quotes
   * @param input : string
   * @returns string after remove all html tag and quotes
   */
  removeHtmlTag(input) {
    input = input + "";
    return input.replace(/(<([^>]+)>)/gi, "").replaceAll('"', "");
  },
  addLeadingZeros: function (num: number, totalLength: number) {
    return String(num).padStart(totalLength, "0");
  },
  escape(htmlStr) {
    if (isEmpty(htmlStr)) return "";
    return htmlStr
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },
  unEscape(htmlStr) {
    htmlStr = htmlStr.replace(/&lt;/g, "<");
    htmlStr = htmlStr.replace(/&gt;/g, ">");
    htmlStr = htmlStr.replace(/&quot;/g, '"');
    htmlStr = htmlStr.replace(/&#39;/g, "'");
    htmlStr = htmlStr.replace(/&amp;/g, "&");
    return htmlStr;
  },
  b64toBlob(b64Data: any, contentType: string, sliceSize?: number) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  },
  isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  },

  secondsToHms(secon: any) {
    secon = Number(secon);
    const h = Math.floor(secon / 3600);
    const m = Math.floor((secon % 3600) / 60);
    const s = Math.floor((secon % 3600) % 60);
    return (h ? addZeroString(h) + ":" : "") + addZeroString(m) + ":" + addZeroString(s);
  },
  hoursToHms(hour: any) {
    hour = Number(hour);
    let decimalTime = parseFloat(hour);
    decimalTime = decimalTime * 60 * 60;
    const h = Math.floor(decimalTime / (60 * 60));
    decimalTime = decimalTime - h * 60 * 60;
    const m = Math.floor(decimalTime / 60);
    decimalTime = decimalTime - m * 60;
    const s = Math.round(decimalTime);
    return (h ? addZeroString(h) + ":" : "") + addZeroString(m) + ":" + addZeroString(s);
  },
  convertMinutesToHoursMinutes(minutes: number) {
    // Calculate hours and remaining minutes
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    // Return the formatted string
    return {
      hours: hours,
      remainingMinutes: remainingMinutes,
    };
  },
  //Get answers from localStorage
  getAnswersFromLocalStorage(quizId, questionUniqueId) {
    let quizStorage: any = localStorage.getItem("quizPracticeStorage");
    if (quizStorage != null) {
      quizStorage = FunctionBase.isJsonString(quizStorage) ? JSON.parse(quizStorage) : [];
      if (quizStorage.length > 0) {
        if (quizStorage.some((i: any) => i?.quizId == quizId)) {
          let indexOfquiz = quizStorage.findIndex((i: any) => i?.quizId == quizId);
          if (indexOfquiz > -1) {
            let currentQuiz = quizStorage[indexOfquiz];
            let currentQuestionsOfQuiz = currentQuiz?.questions;
            //Check have question
            if (currentQuestionsOfQuiz.some((i: any) => i?.questionId == questionUniqueId)) {
              //Case already have question -> replace answers
              let indexOfQuestion = currentQuestionsOfQuiz.findIndex((i: any) => i?.questionId == questionUniqueId);
              if (indexOfQuestion > -1) {
                return currentQuestionsOfQuiz[indexOfQuestion].answers;
              }
            }
          }
        }
      }
    }
    return [];
  },
  clearLocalStorageByQuizId(quizId) {
    let quizStorage: any = localStorage.getItem("quizPracticeStorage");
    if (quizStorage != null) {
      quizStorage = FunctionBase.isJsonString(quizStorage) ? JSON.parse(quizStorage) : [];
      if (quizStorage.length > 0) {
        if (quizStorage.some((i: any) => i?.quizId == quizId)) {
          let indexOfquiz = quizStorage.findIndex((i: any) => i?.quizId == quizId);
          if (indexOfquiz > -1) {
            quizStorage.splice(indexOfquiz, 1);
            localStorage.setItem("quizPracticeStorage", JSON.stringify(quizStorage));
          }
        }
      }
    }
  },
  /**
   * Push to localStorage
   * @param quizId id of quiz that is on going
   * @param questionId id of question
   * @param answers list anwers ['string']
   */
  pushDataAnswersToLocalStorage(quizId, questionId, answers) {
    let quizStorage: any = localStorage.getItem("quizPracticeStorage");
    if (quizStorage != null) {
      quizStorage = FunctionBase.isJsonString(quizStorage) ? JSON.parse(quizStorage) : [];
      if (quizStorage.length > 0) {
        //Case new quiz
        if (quizStorage.some((i: any) => i?.quizId == quizId)) {
          //Case quiz existed
          let indexOfquiz = quizStorage.findIndex((i: any) => i?.quizId == quizId);
          if (indexOfquiz > -1) {
            let currentQuiz = quizStorage[indexOfquiz];
            let currentQuestionsOfQuiz = currentQuiz?.questions;
            //Check have question
            if (currentQuestionsOfQuiz.some((i: any) => i?.questionId == questionId)) {
              //Case already have question -> replace answers
              let indexOfQuestion = currentQuestionsOfQuiz.findIndex((i: any) => i?.questionId == questionId);
              if (indexOfQuestion > -1) {
                currentQuestionsOfQuiz[indexOfQuestion].answers = answers;
              }
            } else {
              //Case no question, push to array
              currentQuestionsOfQuiz.push({
                questionId: questionId,
                answers: answers,
              });
              currentQuiz.questions = currentQuestionsOfQuiz;
            }
            quizStorage[indexOfquiz] = currentQuiz;
          }
        } else {
          let questionItem = {
            questionId: questionId,
            answers: answers,
          };
          quizStorage.push({
            quizId: quizId,
            questions: [questionItem],
          });
        }
        localStorage.setItem("quizPracticeStorage", JSON.stringify(quizStorage));
      } else {
        let _quizStorage: any = [];
        let questionItem = {
          questionId: questionId,
          answers: answers,
        };
        _quizStorage.push({
          quizId: quizId,
          questions: [questionItem],
        });
        localStorage.setItem("quizPracticeStorage", JSON.stringify(_quizStorage));
      }
    } else {
      let _quizStorage: any = [];
      let questionItem = {
        questionId: questionId,
        answers: answers,
      };
      _quizStorage.push({
        quizId: quizId,
        questions: [questionItem],
      });
      localStorage.setItem("quizPracticeStorage", JSON.stringify(_quizStorage));
    }
  },
  slugify(str) {
    try {
      let slug = str;
      slug = str.toLowerCase();
      slug = slug.split("c++").join("cpp");
      slug = slug.split("c#").join("csharp");
      //Đổi ký tự có dấu thành không dấu
      slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, "a");
      slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, "e");
      slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, "i");
      slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, "o");
      slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, "u");
      slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, "y");
      slug = slug.replace(/đ/gi, "d");
      //Xóa các ký tự đặt biệt
      slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, "");
      slug = slug.replace(/\s*-+\s*/g, " ");
      //Đổi khoảng trắng thành ký tự gạch ngang
      slug = slug.replace(/\s+/gi, " - ");
      //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
      //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
      //slug = slug.replace(/\-\-\-\-\-/gi, '-');
      //slug = slug.replace(/\-\-\-\-/gi, '-');
      //slug = slug.replace(/\-\-\-/gi, '-');
      //slug = slug.replace(/\-\-/gi, '-');
      slug = slug.replace(/\s/g, "");
      //Xóa các ký tự gạch ngang ở đầu và cuối
      slug = "@" + slug + "@";
      slug = slug.replace(/\@\-|\-\@|\@/gi, "");
      return slug;
    } catch (e) {
      return "";
    }
  },
  //Get executions
  getExecutions(quizId) {
    let quizStorage: any = localStorage.getItem("quizPracticeStorage");
    if (quizStorage != null) {
      quizStorage = FunctionBase.isJsonString(quizStorage) ? JSON.parse(quizStorage) : [];
      if (quizStorage.length > 0) {
        if (quizStorage.some((i: any) => i?.quizId == quizId)) {
          let indexOfQuiz = quizStorage.findIndex((i: any) => i?.quizId == quizId);
          if (indexOfQuiz > -1) {
            let currentQuiz = quizStorage[indexOfQuiz];
            let currentQuestionsOfQuiz = currentQuiz?.questions;
            if (currentQuestionsOfQuiz.length > 0) {
              return currentQuestionsOfQuiz;
            }
          }
        }
      }
    }
    return [];
  },
  parseIntValue: (data: any, fields: any) => {
    let temps = { ...data };
    for (let x of fields) {
      temps = {
        ...temps,
        [x]: parseInt(temps[x]),
      };
    }
    return temps;
  },
  groupByField: (data: any, field: any) => {
    let groups = data.reduce(function (obj: any, item: any) {
      obj[item[field]] = obj[item[field]] || [];
      obj[item[field]].push(item);
      return obj;
    }, {});
    var result = Object.keys(groups).map(function (key) {
      return { [field]: key, data: groups[key] };
    });
    return result;
  },
  groupListByField: (list: any, groupField: string, key: string = "Id") => {
    var map: any = {},
      node,
      roots = [],
      i;
    for (i = 0; i < list.length; i += 1) {
      map[list[i][key]] = i;
      list[i].children = [];
    }

    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node[groupField] !== 0) {
        list[map[node[groupField]]]?.children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  },
  decimalCount: (num: any) => {
    // Convert to String
    const numStr = String(num);
    // String Contains Decimal
    if (numStr.includes(".")) {
      return numStr.split(".")[1].length;
    }
    // String Does Not Contain Decimal
    return 0;
  },
  removeUndefinedProperty: (obj: any) => {
    return Object.keys(obj).reduce((acc: any, key: any) => {
      const _acc = acc;
      if (obj[key] !== undefined) _acc[key] = obj[key];
      return _acc;
    }, {});
  },
  ruleOperation: (left: any, right: any, operation: any): boolean => {
    if (operation === "and") {
      return left && right;
    }
    return left || right;
  },
};

function addZeroString(str) {
  return str > 9 ? str : "0" + str;
}

export const convertDate = (dateString: any) => {
  if (isNil(dateString)) return null;
  if (isString(dateString) && (dateString as string).endsWith("Z")) {
    return moment(dateString).toDate();
  }
  return moment(dateString + "Z").toDate();
};

export const formatDateGMT = (dateString: any, format = "DD/MM/YYYY") => {
  if (isNil(dateString)) return null;
  let zoneNum = `+0700`;
  return moment.utc(dateString).utcOffset(zoneNum).format(format);
};

export const getAlphabetByPosition = (position: number) => {
  if (position >= 0 && position <= 25) {
    return String.fromCharCode("A".charCodeAt(0) + position);
  } else {
    return null;
  }
};

export const swap = (_arr: any, index1: number, index2: number) => {
  if (isNil(_arr)) return null;
  const arr = _.cloneDeep(_arr);
  const temp = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = temp;
  return arr;
};

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const validateUsername = (userName?: string) => {
  if (!_.isEmpty(userName?.trim())) return false;
  return !EMAIL_PATTERN.test(userName);
};

export const processBreakSpaceComment = (str: string | null | undefined) => {
  if (isNil(str)) return str;
  let result = str;
  result = result.replace(/<br>\s*<br>/g, "");
  result = result.replace(/(<br\s*\/?>)+<\/p>/g, "</p>");
  result = result.replace(/&nbsp;\s*&nbsp;/g, "");
  result = result.replace(/<p>\s*<\/p>/g, "");
  result = result.replace(/<p>\s*&nbsp;\s*<\/p>/g, "");
  result = result.replace(/<p>(&nbsp;)+<br>(&nbsp;)+<\/p>/g, "");
  result = result.replace(/<p>(<br>\s*&nbsp;)?<\/p>/g, "");
  return result;
};

export const Base64 = {
  // private property
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  // public method for encoding
  encode: function (input: string) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output =
        output +
        this._keyStr.charAt(enc1) +
        this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) +
        this._keyStr.charAt(enc4);
    } // Whend

    return output;
  }, // End Function encode

  // public method for decoding
  decode: function (input: string) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }

      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    } // Whend

    output = Base64._utf8_decode(output);

    return output;
  }, // End Function decode

  // private method for UTF-8 encoding
  _utf8_encode: function (string: string) {
    var utftext = "";
    string = string.replace(/\r\n/g, "\n");

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    } // Next n

    return utftext;
  }, // End Function _utf8_encode

  // private method for UTF-8 decoding
  _utf8_decode: function (utftext: string) {
    var string = "";
    var i = 0;
    var c, c1, c2, c3;
    c = c1 = c2 = 0;

    while (i < utftext.length) {
      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    } // Whend

    return string;
  }, // End Function _utf8_decode
};
