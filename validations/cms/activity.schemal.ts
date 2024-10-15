import { processBreakSpaceComment } from "@src/helpers/fuction-base.helpers";
import { isEmpty } from "lodash";
import yup from "./yupGlobal";

//Assignment validation
export const AssignmentSchema = yup.object({
  title: (yup.string() as any)
    .trim()
    .required("The title cannot be blank and cannot exceed 512 characters")
    .max(512, "The title cannot be blank and cannot exceed 512 characters")
    .titleActivity("Title must contain at least one alpha character (A - Z, a - z)"),
  description: (yup.string() as any).trim().nullable(),
  tags: (yup.mixed() as any)
    .validateTagsElementRangeLength(3, 20)
    .validateTotalTags("You are only allowed to create a maximum of 10 tags"),
  duration: (yup.string() as any).required("The duration cannot be blank"),
  // .rangeNumber(0, 600, "Min value is 0, max is 600"),
  point: (yup.string() as any).required("The point cannot be blank").rangeNumber(0, 600, "Min value is 0, max is 600"),
  settings: yup.object({
    passScore: (yup.string() as any)
      .required("Pass score cannot be blank and must be an integer number")
      .rangeNumber(0, 10000, "Pass score must equal or greater than 0 and smaller than 10000"),
    maxScore: (yup.string() as any)
      .required("Max score cannot be blank and must be an integer number")
      .rangeNumber(0, yup.ref("passScore"), "Max score must be more than pass score"),
    // additionalFiles: (yup.mixed() as any).emptyObject("Additional files is required"),
    // maximumUploadFiles: (yup.string() as any)
    //   .required("Maximum number of upload files is required")
    //   .rangeNumber(
    //     1,
    //     10,
    //     "Maximum number of upload files must in range of 1 to 10"
    //   ),
    // maximumUploadFileSize: (yup.string() as any)
    //   .required("Maximum submission file size is required")
    //   .rangeNumber(
    //     1,
    //     10,
    //     "Maximum submission file size must in range of 1MB to 10MB"
    //   ),
    // maximumGrade: (yup.number() as any)
    //   .typeError("Maximum grade must be a number")
    //   .rangeNumber(0, 10, "Maximum grade must in range of 0 to 10"),
    // gradeToPass: (yup.number() as any)
    //   .typeError("Grade to pass must be a number")
    //   .rangeNumber(0, 10, "Grade to pass must in range of 0 to 10"),
  }),
});

export const ScormSchema = yup.object({
  title: (yup.string() as any)
    .trim()
    .required("The title cannot be blank and cannot exceed 512 characters")
    .max(512, "The title cannot be blank and cannot exceed 512 characters")
    .titleActivity("Title must contain at least one alpha character (A - Z, a - z)"),
  description: (yup.string() as any).trim().nullable(),
  tags: (yup.mixed() as any)
    .validateTagsElementRangeLength(3, 20)
    .validateTotalTags("You are only allowed to create a maximum of 10 tags"),
  duration: (yup.string() as any).required("The duration cannot be blank"),
  // .rangeNumber(0, 600, "Min value is 0, max is 600"),
  point: (yup.string() as any).required("The point cannot be blank").rangeNumber(0, 600, "Min value is 0, max is 600"),
  settings: yup.object({
    packageUrl: (yup.string() as any).trim().required("Attachment files is required"),
  }),
  //additionalFiles: (yup.mixed() as any).emptyObject("Additional files is required"),
  // maximumUploadFiles: (yup.string() as any)
  //   .required("Maximum number of upload files is required")
  //   .rangeNumber(
  //     1,
  //     10,
  //     "Maximum number of upload files must in range of 1 to 10"
  //   ),
  // maximumUploadFileSize: (yup.string() as any)
  //   .required("Maximum submission file size is required")
  //   .rangeNumber(
  //     1,
  //     10,
  //     "Maximum submission file size must in range of 1MB to 10MB"
  //   ),
  // maximumGrade: (yup.number() as any)
  //   .typeError("Maximum grade must be a number")
  //   .rangeNumber(0, 10, "Maximum grade must in range of 0 to 10"),
  // gradeToPass: (yup.number() as any)
  //   .typeError("Grade to pass must be a number")
  //   .rangeNumber(0, 10, "Grade to pass must in range of 0 to 10"),
  //}),
});

//Attachment validation
export const AttachmentSchema = yup.object({
  title: (yup.string() as any)
    .trim()
    .required("The title cannot be blank and cannot exceed 512 characters")
    .max(512, "The title cannot be blank and cannot exceed 512 characters")
    .titleActivity("Title must contain at least one alpha character (A - Z, a - z)"),
  duration: (yup.string() as any).required("The duration cannot be blank"),
  // .rangeNumber(0, 600, "Min value is 0, max is 600"),
  point: (yup.string() as any).required("The point cannot be blank").rangeNumber(0, 600, "Min value is 0, max is 600"),
  description: (yup.string() as any).trim().rule_description().required("The description can not be left blank"),
  tags: (yup.mixed() as any)
    .validateTagsElementRangeLength(3, 20)
    .validateTotalTags("You are only allowed to create a maximum of 10 tags"),
  // additionalFiles: (yup.mixed() as any).emptyObject("Additional files is required"),
});

//Scratch validation
export const ScratchSchema = yup.object({
  title: (yup.string() as any)
    .trim()
    .required("The title cannot be blank and cannot exceed 512 characters")
    .max(512, "The title cannot be blank and cannot exceed 512 characters")
    .titleActivity("Title must contain at least one alpha character (A - Z, a - z)"),
  description: (yup.string() as any).trim().rule_description().required("The description can not be left blank"),
  tags: (yup.mixed() as any)
    .validateTagsElementRangeLength(3, 20)
    .validateTotalTags("You are only allowed to create a maximum of 10 tags"),
  duration: (yup.string() as any).required("The duration cannot be blank"),
  point: (yup.string() as any).required("The point cannot be blank").rangeNumber(0, 600, "Min value is 0, max is 600"),
  settings: yup.object({
    passScore: (yup.string() as any)
      .required("Pass score cannot be blank and must be an integer number")
      .rangeNumber(0, 10000, "Pass score must equal or greater than 0 and smaller than 10000"),
    maxScore: (yup.string() as any)
      .required("Max score cannot be blank and must be an integer number")
      .rangeNumber(0, yup.ref("passScore"), "Max score must be more than pass score"),
  }),
});

//Reading validation
export const ReadingSchema = yup.object({
  title: (yup.string() as any)
    .trim()
    .required("The title cannot be blank and cannot exceed 512 characters")
    .max(512, "The title cannot be blank and cannot exceed 512 characters")
    .titleActivity("Title must contain at least one alpha character (A - Z, a - z)"),
  description: (yup.string() as any).trim().rule_description().required("The description can not be left blank"),
  tags: (yup.mixed() as any)
    .validateTagsElementRangeLength(3, 20)
    .validateTotalTags("You are only allowed to create a maximum of 10 tags"),
  duration: (yup.string() as any).required("The duration cannot be blank"),
  // .rangeNumber(0, 600, "Min value is 0, max is 600"),
  point: (yup.string() as any).required("The point cannot be blank").rangeNumber(0, 600, "Min value is 0, max is 600"),
  // settings: yup.object({
  //   timeSpendAmount: (yup.number() as any)
  //     .typeError("Time spend must be a number")
  //     .rangeNumber(0, 60, "Time spend must in range of 0 to 60"),
  // }),
});

//Video validation
export const VideoSchema = yup.object({
  title: (yup.string() as any)
    .trim()
    .required("The title cannot be blank and cannot exceed 512 characters")
    .max(512, "The title cannot be blank and cannot exceed 512 characters")
    .titleActivity("Title must contain at least one alpha character (A - Z, a - z)"),
  tags: (yup.mixed() as any)
    .validateTagsElementRangeLength(3, 20)
    .validateTotalTags("You are only allowed to create a maximum of 10 tags"),
  duration: (yup.string() as any).required("The duration cannot be blank"),
  // .rangeNumber(0, 600, "Min value is 0, max is 600"),
  point: (yup.string() as any).required("The point cannot be blank").rangeNumber(0, 600, "Min value is 0, max is 600"),
  settings: yup.object({
    url: (yup.string() as any).trim().required("Video url is required").validUrl("Invalid url"),
  }),
});

//Feedback validation
export const FeedbackSchema = yup.object({
  title: (yup.string() as any)
    .trim()
    .required("The title cannot be blank and cannot exceed 512 characters")
    .max(512, "The title cannot be blank and cannot exceed 512 characters")
    .titleActivity("Title must contain at least one alpha character (A - Z, a - z)"),
  tags: (yup.mixed() as any)
    .validateTagsElementRangeLength(3, 20)
    .validateTotalTags("You are only allowed to create a maximum of 10 tags"),
  duration: (yup.string() as any).required("The duration cannot be blank"),
  // .rangeNumber(0, 600, "Min value is 0, max is 600"),
  point: (yup.string() as any).required("The point cannot be blank").rangeNumber(0, 600, "Min value is 0, max is 600"),
  settings: yup.object({
    statements: (yup.array() as any)
      .of(
        yup.object().shape({
          content: (yup.string() as any)
            .trim()
            .required("This field is required, do not be left blank.")
            .max(256, "The statement cannot exceed 256 characters"),
        })
      )
      .rule_Statement_Duplicate_Check(),
  }),
});

export const FeedbackDefaultSchema = yup.object({
  settings: yup.object({
    statements: (yup.array() as any)
      .of(
        yup.object().shape({
          content: (yup.string() as any)
            .trim()
            .required("This field is required, do not be left blank.")
            .max(256, "The title cannot exceed 256 characters"),
        })
      )
      .rule_Statement_Duplicate_Check(),
  }),
});

//CQ validation
export const CQSchema = yup.object({
  title: (yup.string() as any)
    .trim()
    .required("The title cannot be blank and cannot exceed 512 characters")
    .max(512, "The title cannot be blank and cannot exceed 512 characters")
    .titleActivity("Title must contain at least one alpha character (A - Z, a - z)"),
  duration: (yup.string() as any).required("The duration cannot be blank"),
  // .rangeNumber(0, 600, "Min value is 0, max is 600"),
  point: (yup.string() as any).required("The point cannot be blank").rangeNumber(0, 600, "Min value is 0, max is 600"),
  tags: (yup.mixed() as any)
    .validateTagsElementRangeLength(3, 20)
    .validateTotalTags("You are only allowed to create a maximum of 10 tags"),
  description: (yup.string() as any).trim().nullable(),
  settings: yup.object({
    commentCountRequired: yup
      .number()
      .typeError("Please enter values in the pass criteria fields")
      .min(0, "The values in the pass criteria fields must be greater than or equal to 0"),
    starReceivedCountRequired: yup
      .number()
      .typeError("Please enter values in the pass criteria fields")
      .min(0, "The values in the pass criteria fields must be greater than or equal to 0"),
    numberOfVoteRequired: yup
      .number()
      .typeError("Please enter values in the pass criteria fields")
      .min(0, "The values in the pass criteria fields must be greater than or equal to 0"),
    maxNumberOfComment: (yup.mixed() as any)
      // .typeError(
      //   'The number of comments to post must be a number from 1 to 100',
      // )
      // .min(1, 'The number of comments to post must be a number from 1 to 100')
      // .max(100, 'The number of comments to post must be a number from 1 to 100')
      .checkmaxNumberOfComment(),
    maxOutSideCommentsToView: (yup.mixed() as any)
      // .typeError(
      //   'The number of comments to view must be a number from 1 to 100',
      // )
      // .min(1, 'The number of comments to view must be a number from 1 to 100')
      // .max(
      //   100,
      //   'The number of comments to view must be a number from 1 to 100',
      // )
      .checkmaxNumberOfCommentToView(),

    cards: (yup.array() as any)
      .requireCardSetting()
      .nonNegativeStars()
      .nonNegativeQuantity()
      .maxNumCardValue()
      .maxNumCardQuantity(),
  }),
});

//CQ Default Setting
export const CQDefaultSettingSchema = yup.object({
  settings: yup.object({
    commentCountRequired: yup
      .number()
      .typeError("Please enter values in the pass criteria fields")
      .min(0, "The values in the pass criteria fields must be greater than or equal to 0"),
    starReceivedCountRequired: yup
      .number()
      .typeError("Please enter values in the pass criteria fields")
      .min(0, "The values in the pass criteria fields must be greater than or equal to 0"),
    numberOfVoteRequired: yup
      .number()
      .typeError("Please enter values in the pass criteria fields")
      .min(0, "The values in the pass criteria fields must be greater than or equal to 0"),
    maxNumberOfComment: (yup.mixed() as any).checkmaxNumberOfComment(),
    maxOutSideCommentsToView: (yup.mixed() as any).checkmaxNumberOfCommentToView(),

    cards: (yup.array() as any)
      .requireCardSetting()
      .nonNegativeStars()
      .nonNegativeQuantity()
      .maxNumCardValue()
      .maxNumCardQuantity(),
  }),
});

//CQ validation
export const ActivitySectionFormSchema = yup.object({
  title: (yup.string() as any)
    .trim()
    .required("Title is required")
    .min(5, "Title must be greater than 5 characters")
    .max(4096, "Title must be less than or equal to 4096 characters")
    .titleActivity("Title must contain at least one alpha character (A - Z, a - z)"),
});

//Feedback validation
export const PollSchema = yup.object({
  title: (yup.string() as any)
    .trim()
    .required("The title cannot be blank and cannot exceed 512 characters")
    .max(512, "The title cannot be blank and cannot exceed 512 characters")
    .titleActivity("Title must contain at least one alpha character (A - Z, a - z)"),
  duration: (yup.string() as any).required("The duration cannot be blank"),
  // .rangeNumber(0, 600, "Min value is 0, max is 600"),
  point: (yup.string() as any).required("The point cannot be blank").rangeNumber(0, 600, "Min value is 0, max is 600"),
  tags: (yup.mixed() as any)
    .validateTagsElementRangeLength(3, 20)
    .validateTotalTags("You are only allowed to create a maximum of 10 tags"),
  description: (yup.string() as any).trim().nullable(),
  settings: yup.object({
    options: (yup.mixed() as any)
      .validateNumberOfOptions("Poll must have at least two options")
      .validateLengthOptionsPoll("Options can not be blank or exceed 256 characters")
      .uniqueStrings("Titles of the options cannot duplicate"),
  }),
});

//Quiz valiation
export const QuizDefaultSchema = yup.object({
  settings: yup.object({
    timeLimit: yup
      .number()
      .typeError("This field is required, do not be left blank.")
      .min(1, "Please enter a value greater than or equal to 1.")
      .max(180, "Please enter a value less than or equal to 180."),
    // .integer('This field must contain an integer')
    numberOfTries: yup
      .number()
      .typeError("This field is required, do not be left blank.")
      .min(0, "Please enter a value greater than or equal to 0.")
      .max(10000, "Please enter a value less than or equal to 10000.")
      .integer("This field must contain an integer"),
    gapTimeOfTries: yup
      .number()
      .typeError("This field is required, do not be left blank.")
      .min(0, "Please enter a value greater than or equal to 0.")
      .max(10000, "Please enter a value less than or equal to 10000.")
      .integer("This field must contain an integer"),
    completionPercentage: yup
      .number()
      .typeError("This field is required, do not be left blank.")
      .min(0, "Please enter a value greater than or equal to 0.")
      .max(100, "Please enter a value less than or equal to 10000.")
      .integer("This field must contain an integer"),
    numberOfQuestions: yup
      .number()
      .typeError("This field is required, do not be left blank.")
      .min(0, "Please enter a value greater than or equal to 0.")
      .max(200, "Please enter a value less than or equal to 200.")
      .integer("This field must contain an integer"),
  }),
});

//Quiz valiation
export const QuizSchema = yup.object({
  title: (yup.string() as any)
    .trim()
    .required("The title cannot be blank and cannot exceed 512 characters")
    .max(512, "The title cannot be blank and cannot exceed 512 characters")
    .titleActivity("Title must contain at least one alpha character (A - Z, a - z)"),
  description: yup
    .string()
    .test("emptyDesc", "The description can not be left blank", (value) => !isEmpty(processBreakSpaceComment(value))),
  duration: (yup.string() as any).required("The duration cannot be blank"),
  // .rangeNumber(0, 600, "Min value is 0, max is 600"),
  point: (yup.string() as any).required("The point cannot be blank").rangeNumber(0, 600, "Min value is 0, max is 600"),
  tags: (yup.mixed() as any)
    .validateTagsElementRangeLength(3, 20)
    .validateTotalTags("You are only allowed to create a maximum of 10 tags"),
  settings: yup.object({
    allowTimeLimit: yup.boolean(),
    timeLimit: yup.number().when("allowTimeLimit", {
      is: (val: boolean) => val === true,
      then: yup
        .number()
        .typeError("This field is required, do not be left blank.")
        .min(1, "Please enter a value greater than or equal to 1.")
        .max(180, "Please enter a value less than or equal to 180.")
        .integer("This field must contain an integer"),
    }),

    numberOfTries: yup
      .number()
      .typeError("This field is required, do not be left blank.")
      .min(0, "Please enter a value greater than or equal to 0.")
      .max(10000, "Please enter a value less than or equal to 10000.")
      .integer("This field must contain an integer"),
    gapTimeOfTries: yup
      .number()
      .typeError("This field is required, do not be left blank.")
      .min(0, "Please enter a value greater than or equal to 0.")
      .max(10000, "Please enter a value less than or equal to 10000.")
      .integer("This field must contain an integer"),
    completionPercentage: yup.number().when("requiedGrade", {
      is: (val: boolean) => val === true,
      then: yup
        .number()
        .typeError("This field is required, do not be left blank.")
        .min(1, "Please enter a value greater than or equal to 1.")
        .max(100, "Please enter a value less than or equal to 100.")
        .integer("This field must contain an integer"),
    }),
    numberOfQuestions: yup
      .number()
      .typeError("This field is required and must be a number.")
      .min(0, "Please enter a value greater than or equal to 0.")
      .max(200, "Please enter a value less than or equal to 200.")
      .integer("This field must contain an integer"),
    requiedGrade: yup.boolean(),
    bankConfigs: (yup.array() as any)
      .of(
        yup.object().shape({
          minQuestions: yup
            .number()
            .typeError("This field is required, do not be left blank.")
            .min(1, "Please enter a value greater than or equal to 1.")
            .integer("This field must contain an integer"),
          maxQuestions: yup
            .number()
            .typeError("This field is required, do not be left blank.")
            .integer("This field must contain an integer")
            .min(1, "Please enter a value greater than or equal to 1.")
            .test({
              message: "Max number must be greater than min number",
              test: function (value: any) {
                const minNumber = this.parent.minQuestions;
                if (value < minNumber) {
                  return false;
                }
                return true;
              },
            })
            .test({
              message: "Please enter a value less than or equal to total question of bank",
              test: function () {
                const totalQuestion = this.parent.totalQuestions;

                const maxNumber = this.parent.maxQuestions;
                if (maxNumber > totalQuestion) {
                  return this.createError({
                    message: `Please enter a value less than or equal to ${totalQuestion}`,
                  });
                }
                return true;
              },
            }),
        })
      )
      .rule_BankConfigs_Empty_Bank_Check()
      .when("requiedGrade", {
        is: (val: boolean) => val === true,
        then: (yup.array() as any)
          .of(
            yup.object().shape({
              pointPercent: yup
                .number()
                .integer("Point percentage must be an integer number")
                .typeError("This field is required, do not be left blank.")
                .min(1, "Please enter a value greater than or equal to 1."),
            })
          )

          .rule_BankConfigs_Total_Point_Check(),
      })
      .nullable(),
    questionConfigs: (yup.array() as any)
      .when("requiedGrade", {
        is: (val: boolean) => val === true,
        then: (yup.array() as any).of(
          yup.object().shape({
            mark: yup
              .number()
              .min(1, "Please enter a value greater than or equal to 1.")
              .max(99.99, "Please enter a number less than or equal to 99,99.")
              .typeError("This field is required, do not be left blank."),
          })
        ),
      })
      .max(200, "The number of questions cannot exceed 200, please check again.")
      .nullable(),
  }),
});
