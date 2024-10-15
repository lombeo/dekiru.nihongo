import { questionTypes } from "constants/cms/question-bank/question.constant";
import { v4 as uuidv4 } from "uuid";
import { resolveLanguage } from "./helper";

export const QuestionHelper = {
  getQuestionByType: (questionType: any) => {
    return questionTypes.find((x: any) => x.type === questionType);
  },
  getMatchingAnswersData: (data: any, locale: any) => {
    return data.map((x: any) => {
      const multipleLang = resolveLanguage(x, locale) || x;
      let isPair = true;
      let prompt = multipleLang?.prompt;
      if (prompt == "") {
        prompt = uuidv4();
        isPair = false;
      }
      return {
        ...x,
        prompt: prompt,
        isPair: isPair,
        uid: uuidv4(),
      };
    });
  },
  preAnswersData: (answersPreData: any, locale: any) => {
    let responseAnswers = [...answersPreData];
    let rawsList = responseAnswers.map((x: any) => {
      const multipleLang = resolveLanguage(x, locale) || x;
      return {
        ...multipleLang,
        raws: multipleLang.content?.split("###")?.map((y: any) => {
          return {
            text: y,
          };
        }),
      };
    });
    return rawsList;
  },
};
