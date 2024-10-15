import * as yup from "yup";

const REGEX_PASSWORD = /^[A-Za-z0-9!@#$%^&*()]+$/;
const REGEX_ONLY_NUMBER = /^\d+$/;
const REGEX_ROLL_NUMBER = /^[a-zA-Z0-9]*$/;
const REGEX_PHONE_NUMBER = /^\+?(\([0-9]{1,3}\))?([0-9]{4,16})$/;
const REGEX_URL = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?%#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
const REGEX_NO_ALPHACHARACTER = /.*[A-Za-z].*/;
const REGEX_FUNCTION_NAME = /^[a-zA-Z{1}][a-zA-Z0-9_]+$/;

//Validate function name
yup.addMethod(yup.string, "functionName", function (message) {
  return this.matches(REGEX_FUNCTION_NAME, {
    message,
    excludeEmptyString: true,
  });
});
yup.addMethod(yup.string, "code", function (message) {
  return this.matches(REGEX_FUNCTION_NAME, {
    message,
    excludeEmptyString: true,
  });
});
yup.addMethod(yup.string, "password", function (message) {
  return this.matches(REGEX_PASSWORD, {
    message,
    excludeEmptyString: true,
  });
});

yup.addMethod(yup.string, "titleActivity", function (message) {
  return this.matches(REGEX_NO_ALPHACHARACTER, {
    message,
    excludeEmptyString: true,
  });
});

yup.addMethod(yup.string, "phoneNumber", function (message) {
  return this.matches(REGEX_PHONE_NUMBER, {
    message,
    excludeEmptyString: true,
  });
});

//Valid url website
yup.addMethod(yup.string, "validUrl", function (message) {
  return this.matches(REGEX_URL, {
    message,
    excludeEmptyString: true,
  });
});

//Number only
yup.addMethod(yup.string, "onlyNumber", function (message) {
  return this.matches(REGEX_ONLY_NUMBER, {
    message,
    excludeEmptyString: true,
  });
});

//Has at least one answer
yup.addMethod(yup.array, "rule_AnswerList_Require_Check", function (msg = "Need to have one right answer") {
  return this.test({
    name: "length",
    message: msg,
    test: (value: any) => {
      var isInvalid = value.every((x: any) => x.isCorrect == false);
      if (isInvalid) {
        return false;
      }
      return true;
    },
  });
});

// check duplicate answer content
yup.addMethod(
  yup.mixed,
  "rule_Statement_Duplicate_Check",
  function (msg = "There exist duplicate statements in the list. Please check again") {
    return this.test({
      name: "length",
      message: msg,
      test: (value: any) => {
        const listAnswers = value;
        var valueArr = listAnswers.map((item: any) => {
          return item.content.toLowerCase();
        });
        if (valueArr.some((item: any) => item == "")) {
          return true;
        } else {
          var isDuplicate = valueArr.some(function (item: any, idx: any) {
            return valueArr.indexOf(item.toLowerCase()) != idx;
          });
          return !isDuplicate;
        }
      },
    });
  }
);

//Check empty object
yup.addMethod(yup.mixed, "emptyObject", function (message) {
  return this.test({
    name: "length",
    message: message,
    test: (value: any) => {
      const hasNoProperty = Object.keys(value).length === 0;
      if (hasNoProperty) {
        return false;
      }
      return true;
    },
  });
});

//Range number (Ex: from 1 to 10)
yup.addMethod(yup.mixed, "inRangeNumber", function (min, max, message) {
  return this.test({
    name: "length",
    message: message,
    test: (value: any) => {
      //if(value.includes('e')) return false;
      if (parseInt(value) < min || parseInt(value) > max) {
        return false;
      } else {
        return true;
      }
    },
  });
});

yup.addMethod(yup.mixed, "rangeNumber", function (min, max, message) {
  return this.test({
    name: "length",
    message: message,
    test: (value: any) => {
      if (value.includes("e")) return false;
      if (value.includes("e")) return false;
      if (parseInt(value) < min || parseInt(value) > max) {
        return false;
      } else {
        return true;
      }
    },
  });
});

yup.addMethod(yup.mixed, "greater", function (max, message) {
  return this.test({
    name: "length",
    message: message,
    test: (value: any) => {
      if (value.includes("e")) return false;
      if (value.includes("e")) return false;
      if (parseInt(value) > max) {
        return false;
      } else {
        return true;
      }
    },
  });
});

yup.addMethod(yup.mixed, "less", function (min, message) {
  return this.test({
    name: "length",
    message: message,
    test: (value: any) => {
      if (value.includes("e")) return false;
      if (value.includes("e")) return false;
      if (parseInt(value) < min) {
        return false;
      } else {
        return true;
      }
    },
  });
});

//In range of a string length
yup.addMethod(yup.mixed, "inRangeString", function (isRequire = false, min, max, message) {
  return this.test({
    name: "length",
    message: message,
    test: (value: any) => {
      if (isRequire) {
        if (value.length < min || value.length > max) {
          return false;
        } else {
          return true;
        }
      } else {
        if ((value.length < min || value.length > max) && value.length > 0) {
          return false;
        } else {
          return true;
        }
      }
    },
  });
});

//Validate cards setting
yup.addMethod(
  yup.array,
  "requireCardSetting",
  function (message = "Star or Quantity setting fields are required and must be a valid number") {
    return this.test({
      name: "length",
      message: message,
      test: (arr: any) => {
        let isValid = true;
        if (arr.length > 0) {
          for (const item of arr) {
            if (isNaN(parseInt(item.quantity)) || isNaN(parseInt(item.starValue))) {
              isValid = false;
              break;
            }
          }
        }
        return isValid;
      },
    });
  }
);

//Validate cards setting
yup.addMethod(yup.array, "nonNegativeStars", function (message = "Star value must be greater than or equal to zero") {
  return this.test({
    name: "length",
    message: message,
    test: (arr: any) => {
      let isValid = true;
      if (arr.length > 0) {
        for (const item of arr) {
          if (!isNaN(parseInt(item.quantity)) && !isNaN(parseInt(item.starValue))) {
            if (item.starValue < 0) {
              isValid = false;
              break;
            }
          }
        }
      }
      return isValid;
    },
  });
});

yup.addMethod(
  yup.array,
  "nonNegativeQuantity",
  function (message = "Quantity value must be greater than or equal to zero") {
    return this.test({
      name: "length",
      message: message,
      test: (arr: any) => {
        let isValid = true;
        if (arr.length > 0) {
          for (const item of arr) {
            if (!isNaN(parseInt(item.quantity)) && !isNaN(parseInt(item.starValue))) {
              if (item.quantity < 0) {
                isValid = false;
                break;
              }
            }
          }
        }
        return isValid;
      },
    });
  }
);
yup.addMethod(yup.array, "maxNumCardValue", function (message = "Star value cannot exceed 10 000") {
  return this.test({
    name: "length",
    message: message,
    test: (arr: any) => {
      let isValid = true;
      if (arr.length > 0) {
        for (const item of arr) {
          if (!isNaN(parseInt(item.quantity)) && !isNaN(parseInt(item.starValue))) {
            if (item.starValue > 10000) {
              isValid = false;
              break;
            }
          }
        }
      }
      return isValid;
    },
  });
});

yup.addMethod(yup.array, "maxNumCardQuantity", function (message = "Quantity value cannot exceed 10 000") {
  return this.test({
    name: "length",
    message: message,
    test: (arr: any) => {
      let isValid = true;
      if (arr.length > 0) {
        for (const item of arr) {
          if (!isNaN(parseInt(item.quantity)) && !isNaN(parseInt(item.starValue))) {
            if (item.quantity > 10000) {
              isValid = false;
              break;
            }
          }
        }
      }
      return isValid;
    },
  });
});

//File size validate
yup.addMethod(yup.mixed, "fileSizeMax", function (size = 10, message = "File size can not exceed " + size + "MB") {
  return this.test({
    name: "length",
    message: message,
    test: (file: any) => {
      let isValid = true;
      let _file = file[Object.keys(file)[0]];
      if (typeof _file != "undefined" && _file != null) {
        isValid = _file.size <= 1024 * size * 1000;
      }
      return isValid;
    },
  });
});

//File size validate
yup.addMethod(
  yup.mixed,
  "fileSizeZero",
  function (message = "Uploaded file size is too small or invalid, please check again") {
    return this.test({
      name: "length",
      message: message,
      test: (file: any) => {
        let isValid = true;
        let _file = file[Object.keys(file)[0]];
        if (typeof _file != "undefined" && _file != null) {
          isValid = _file.size != 0;
        }
        return isValid;
      },
    });
  }
);

//File name validate
yup.addMethod(
  yup.mixed,
  "fileNameMax",
  function (max = 100, message = "File name can not exceed " + max + " characters") {
    return this.test({
      name: "length",
      message: message,
      test: (file: any) => {
        let isValid = true;
        let _file = file[Object.keys(file)[0]];
        if (typeof _file != "undefined" && _file != null) {
          isValid = _file.name.length <= max;
        }
        return isValid;
      },
    });
  }
);

//Roll number
yup.addMethod(yup.string, "checkRollNumber", function (message) {
  return this.matches(REGEX_ROLL_NUMBER, {
    message,
    excludeEmptyString: true,
  });
});

//Validate tags array
yup.addMethod(yup.mixed, "validateTags", function (message) {
  return this.test({
    name: "length",
    message: message,
    test: (arr: any) => {
      let isValid = true;
      if (arr != null) {
        if (arr.length > 0) {
          for (const item of arr) {
            if (item.length > 20) {
              isValid = false;
              break;
            }
          }
        }
      }
      return isValid;
    },
  });
});

yup.addMethod(
  yup.mixed,
  "validateTagsElementRangeLength",
  function (min, max, message = `Tag item must be greater than ${min} and smaller than ${max} characters`) {
    return this.test({
      name: "length",
      message: message,
      test: (arr: any) => {
        let isValid = true;
        if (arr != null) {
          if (arr.length > 0) {
            for (const item of arr) {
              if (item.trim().length < min || item.trim().length > max) {
                isValid = false;
                break;
              }
            }
          }
        }
        return isValid;
      },
    });
  }
);

yup.addMethod(yup.mixed, "validateTotalTags", function (message) {
  return this.test({
    name: "length",
    message: message,
    test: (arr: any) => {
      if (arr != null) {
        if (arr.length > 10) {
          return false;
        }
      }
      return true;
    },
  });
});

//Disable null
yup.addMethod(yup.mixed, "disableNull", function (message) {
  return this.test({
    name: "length",
    message: message,
    test: (param: any) => {
      return param ?? false;
    },
  });
});

//Validate options title poll
yup.addMethod(yup.mixed, "validateLengthOptionsPoll", function (message) {
  return this.test({
    name: "length",
    message: message,
    test: (arr: any) => {
      let isValid = true;
      if (arr != null) {
        if (arr.length > 0) {
          for (const item of arr) {
            if (item.trim().length == 0 || item.trim().length > 256) {
              isValid = false;
              break;
            }
          }
        }
      }
      return isValid;
    },
  });
});

//Validate options title poll
yup.addMethod(yup.mixed, "validateNumberOfOptions", function (message) {
  return this.test({
    name: "length",
    message: message,
    test: (arr: any) => {
      let isValid = true;
      if (arr != null) {
        if (arr.length < 2) {
          isValid = false;
        } else {
          isValid = true;
        }
      }
      return isValid;
    },
  });
});

yup.addMethod(yup.mixed, "uniqueStrings", function (message, mapper = (a: any) => a.trim()) {
  return this.test("uniqueStrings", message, function (list: any) {
    return list.length === new Set(list.map(mapper)).size;
  });
});

//Validate max number of comment
yup.addMethod(
  yup.mixed,
  "checkmaxNumberOfComment",
  function (message = "The number of comments to post must be a number from 1 to 100") {
    return this.test({
      name: "length",
      message: message,
      test: (maxNumberOfComment: any, context: any) => {
        const formData = context.parent;
        if (!formData?.enabledFields?.isStudentCommentLimitation || !formData?.isStudentCommentLimitation) {
          return true;
        }

        let isValid = true;
        if (maxNumberOfComment == null || maxNumberOfComment == "") {
          isValid = false;
        } else {
          if (!isNaN(maxNumberOfComment)) {
            if (parseInt(maxNumberOfComment) < 1 || parseInt(maxNumberOfComment) > 100) {
              isValid = false;
            }
          } else {
            isValid = false;
          }
        }
        return isValid;
      },
    });
  }
);

//Validate max number of comment
yup.addMethod(
  yup.mixed,
  "checkmaxNumberOfCommentToView",
  function (message = "The number of comments to view must be a number from 1 to 100") {
    return this.test({
      name: "length",
      message: message,
      test: (maxNumberOfComment: any, context: any) => {
        const formData = context.parent;
        if (!formData?.enableMaxOutSideCommentsToView || !formData?.isShowTheCommentOfStudentsInOtherGroups) {
          return true;
        }

        let isValid = true;
        if (maxNumberOfComment == null || maxNumberOfComment == "") {
          isValid = false;
        } else {
          if (!isNaN(maxNumberOfComment)) {
            if (parseInt(maxNumberOfComment) < 1 || parseInt(maxNumberOfComment) > 100) {
              isValid = false;
            }
          } else {
            isValid = false;
          }
        }
        return isValid;
      },
    });
  }
);

// check duplicate answer content
yup.addMethod(
  yup.array,
  "rule_BankConfigs_Empty_Bank_Check",
  function (msg = "There are some question banks with no questions. Please check again!") {
    return this.test({
      message: msg,
      test: function (value: any) {
        const listBanks: any = value;
        const failElement = listBanks ? listBanks.find((x: any) => x.totalQuestions === 0) : null;
        if (failElement) {
          return false;
        }
        return true;
      },
    });
  }
);

yup.addMethod(
  yup.array,
  "rule_BankConfigs_Total_Point_Check",
  function (msg = "The Sum of point percentage must be equal to 100%") {
    return this.test({
      message: msg,
      test: function (value: any) {
        const listBanks: any = value;
        if (!listBanks || !listBanks.length) return true;
        let total = 0;
        listBanks.forEach((x: any) => {
          if (!isNaN(x.pointPercent)) {
            total += x.pointPercent;
          }
        });

        return total == 100;
      },
    });
  }
);

yup.addMethod(yup.string, "rule_description", function (msg = "Question content is required") {
  return this.test({
    message: msg,
    test: function (value: any) {
      if (!value) return false;
      if (value.includes("img")) return true;
      const content = value.replace(/(<\/?[^>]+(>|$)|&nbsp;|\s)/g, "");
      if (content === "") return false;

      return true;
    },
  });
});

// check duplicate answer content
yup.addMethod(
  yup.mixed,
  "rule_AnswerList_Duplicate_Check",
  function (msg = "There exists duplicate answers in the list. Please check again") {
    return this.test({
      name: "length",
      message: msg,
      test: (value: any) => {
        const listAnswers = value;
        var valueArr = listAnswers.map((item: any) => {
          return item.content;
        });
        var isDuplicate = valueArr.some(function (item: any, idx: any) {
          return item.length && valueArr.indexOf(item) != idx;
        });
        return !isDuplicate;
      },
    });
  }
);

// check duplicate promp content
yup.addMethod(
  yup.array,
  "rule_AnswerList_Matching_Duplicate_Prompt_Check",
  function (msg = "There are some duplicate prompts. Please check again!") {
    return this.test({
      message: msg,
      test: function (value: any) {
        const listAnswers = value;
        const isSomeEmpty = listAnswers.some((x: any) => !x.content);
        if (isSomeEmpty) return true;

        var valueArr = listAnswers.map((item: any) => {
          return item.prompt.toLowerCase();
        });
        // const parent = this.parent
        // debugger
        var isDuplicate = valueArr.some(function (item: any, idx: any) {
          return valueArr.indexOf(item.toLowerCase()) != idx;
        });
        return !isDuplicate;
      },
    });
  }
);

// check duplicate answer content
yup.addMethod(
  yup.array,
  "rule_AnswerList_Matching_Duplicate_Answer_Check",
  function (msg = "There are some duplicate answers. Please check again!") {
    return this.test({
      message: msg,
      test: function (value: any) {
        const listAnswers = value;
        const isSomeEmpty = listAnswers.some((x: any) => !x.content.length);
        if (isSomeEmpty) return true;
        var valueArr = listAnswers.map((item: any) => {
          return item.content;
        });
        var isDuplicate = valueArr.some(function (item: any, idx: any) {
          return valueArr.indexOf(item) != idx;
        });
        return !isDuplicate;
      },
    });
  }
);

// check duplicate answer content
yup.addMethod(
  yup.array,
  "rule_AnswerList_Matching_Differ_From_Prompt_Answer_Check",
  function (msg = "The prompt must be different from the answers. Please check it again!") {
    return this.test({
      message: msg,
      test: function (value: any) {
        const listAnswers = value;
        const isSomeEmpty = listAnswers.some((x: any) => !x.content.length);
        if (isSomeEmpty) return true;

        var isSame = listAnswers.some((item: any) => {
          return item.content == item.prompt && item.isPair;
        });
        return !isSame;
      },
    });
  }
);

yup.addMethod(
  yup.mixed,
  "rule_AnswerList_Matching_Check",
  function (msg = "There exists duplicate answers in the list. Please check again") {
    return this.test({
      name: "length",
      message: msg,
      test: (value: any) => {
        const listAnswers = value;
        var valueArr = listAnswers.map((item: any) => {
          return item.content;
        });
        var isDuplicate = valueArr.some(function (item: any, idx: any) {
          return valueArr.indexOf(item) != idx;
        });
        return !isDuplicate;
      },
    });
  }
);
export default yup;
