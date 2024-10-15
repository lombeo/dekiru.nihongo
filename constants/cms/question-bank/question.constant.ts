export enum QuestionTypeEnum {
  Multichoice = 0,
  SingleChoice = 1,
  YesOrNo = 2,
  FillInBlank = 3,
  Rating = 4,
  Text = 5,
  Matching = 6,
  Indicate = 7,
  Essay = 8,
}

export const QUESTIONS_BANK_TYPE_SUPPORT: Array<QuestionTypeEnum> = [
  QuestionTypeEnum.Multichoice,
  QuestionTypeEnum.SingleChoice,
  QuestionTypeEnum.YesOrNo,
];

export enum ScoringTypeEnum {
  AllOrNothing = 0,
  PartialCredit = 1,
  SubtractIncorect = 2,
  AllowNegative = 3,
}

export type QuestionTypeMenuItem = {
  type: QuestionTypeEnum;
  label?: string;
  icon?: any;
  name?: string;
  hideInModal?: boolean;
};

const allQuestionTypes: Array<QuestionTypeMenuItem> = [
  {
    label: "Multiple choice",
    icon: "IconReading",
    type: QuestionTypeEnum.Multichoice,
    name: "multichoice",
  },
  {
    label: "Single choice",
    icon: "IconReading",
    type: QuestionTypeEnum.SingleChoice,
    name: "singlechoice",
  },
  {
    label: "True/False",
    icon: "IconReading",
    type: QuestionTypeEnum.YesOrNo,
    name: "yesorno",
  },
  {
    label: "Fill In",
    icon: "IconReading",
    type: QuestionTypeEnum.FillInBlank,
    name: "fillin",
  },
  {
    label: "Matching",
    icon: "IconReading",
    type: QuestionTypeEnum.Matching,
    name: "matching",
  },
  {
    label: "Essay",
    icon: "IconReading",
    type: QuestionTypeEnum.Essay,
    name: "essay",
  },
  {
    label: "Indicate Mistake",
    icon: "IconReading",
    type: QuestionTypeEnum.Indicate,
    name: "indicate",
  },
];
export const questionTypes = allQuestionTypes.filter((item: QuestionTypeMenuItem) =>
  QUESTIONS_BANK_TYPE_SUPPORT.includes(item.type)
);
