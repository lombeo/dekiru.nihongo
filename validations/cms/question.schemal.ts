import yup from "./yupGlobal";

//Question validation
export const QuestionFormSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Question title is required")
    .min(5, "Question title must be greater than 5 characters")
    .max(512, "Question title must no exceed 512 characters"),
  description: (yup.string() as any).trim().rule_description(),
  level: yup.string().required(),
  // mark: (yup.number() as any)
    // .typeError("Grade of question is required")
    // .inRangeNumber(0, 100, "Grade of question must be a number from 0 to 100"),
  answers: (yup.array() as any)
    .of(
      yup.object().shape({
        content: yup.string().trim().required("This field is required, do not be left blank."),
        feedBack: yup.string().trim().max(512, "Feedback must not exceed 512 characters").nullable(),
      })
    )
    .required()
    .rule_AnswerList_Require_Check()
    .rule_AnswerList_Duplicate_Check(),
  tags: (yup.mixed() as any).validateTagsElementRangeLength(3, 20),
});

export const IndicateMistake = yup.object({
  title: yup
    .string()
    .trim()
    .required("Question title is required")
    .min(5, "Question title must be greater than 5 characters")
    .max(512, "Question title must no exceed 512 characters"),
  description: (yup.string() as any).trim().rule_description(),
  level: yup.string().required(),
  // mark: (yup.number() as any)
  //   .typeError("Grade of question is required")
  //   .inRangeNumber(0, 100, "Grade of question must be a number from 0 to 100"),
  answers: (yup.array() as any)
    .of(
      yup.object().shape({
        content: yup.string().trim().required("This field is required, do not be left blank."),
        feedBack: yup.string().trim().max(512, "Feedback must not exceed 512 characters").nullable(),
      })
    )
    .required()
    .rule_AnswerList_Require_Check("Need to have one wrong answer")
    .rule_AnswerList_Duplicate_Check(),
  tags: (yup.mixed() as any).validateTagsElementRangeLength(3, 20),
});

//Question single choice
export const QuestionSingleChoiceSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Question title is required")
    .max(512, "Question title must not exceed 512 characters")
    .min(5, "Question title must be greater than 5 characters"),
  description: (yup.string() as any).trim().rule_description(),
  // mark: (yup.number() as any)
  //   .typeError("Grade of question is required")
  //   .inRangeNumber(0, 100, "Grade of question must be a number from 0 to 100"),
  answers: (yup.array() as any)
    .of(
      yup.object().shape({
        content: yup.string().trim().required("This field is required, do not be left blank."),
        feedBack: yup
          .string()

          .trim()
          .max(512, "Feedback must not exceed 512 characters")
          .nullable(),
      })
    )
    .required()
    .rule_AnswerList_Require_Check()
    .rule_AnswerList_Duplicate_Check(),
  tags: (yup.mixed() as any).validateTagsElementRangeLength(3, 20),
});

export const MatchingQuestionFormSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Question title is required")
    .min(5, "Question title must be greater than 5 characters")
    .max(512, "Question title must no exceed 512 characters"),
  description: (yup.string() as any).trim().rule_description(),
  answers: (yup.array() as any)
    .of(
      yup.object().shape({
        prompt: yup
          .string()
          .trim()
          .max(80, "Prompt must not exceed 80 characters")
          .required("This field is required, do not be left blank.")
          .trim(),
        content: yup
          .string()
          .trim()
          .max(80, "Answer must not exceed 80 characters")
          .required("This field is required, do not be left blank.")
          .trim(),
        feedBack: yup.string().trim().max(512, "Feedback must not exceed 512 characters").nullable(),
      })
    )
    .required()
    .min(2, "You need create at least 2 answers")
    .rule_AnswerList_Matching_Duplicate_Prompt_Check()
    .rule_AnswerList_Matching_Duplicate_Answer_Check()
    .rule_AnswerList_Matching_Differ_From_Prompt_Answer_Check(),
  tags: (yup.mixed() as any).validateTagsElementRangeLength(3, 20),
});

export const FillInQuestionFormSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Question title is required")
    .min(5, "Question title must be greater than 5 characters")
    .max(512, "Question title must no exceed 512 characters"),
  description: (yup.string() as any).trim().rule_description(),
  answers: (yup.array() as any)
    .of(
      yup.object().shape({
        raws: (yup.array() as any).of(
          yup.object().shape({
            text: yup
              .string()
              .trim()
              .max(80, "Answer must not exceed 80 characters")
              .required("This field is required, do not be left blank.")
              .trim(),
          })
        ),
        feedBack: yup.string().trim().max(512, "Feedback must not exceed 512 characters").nullable(),
      })
    )
    .required(),
  tags: (yup.mixed() as any).validateTagsElementRangeLength(3, 20),
});

export const ReadingQuestionFormSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Question title is required")
    .min(5, "Question title must be greater than 5 characters")
    .max(512, "Question title must no exceed 512 characters"),
  description: (yup.string() as any).trim().rule_description(),
  tags: (yup.mixed() as any).validateTagsElementRangeLength(3, 20),
});
