import { Notify } from "@edn/components/Notify/AppNotification";
import { QuestionTypeEnum } from "@src/constants/cms/question-bank/question.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useNextQueryParam } from "@src/helpers/query-utils";
import CmsService from "@src/services/CmsService/CmsService";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { MatchingForm } from "../../activities/form/MatchingForm";
import { EssayForm } from "./EssayForm";
import { FillInForm } from "./FillInForm";
import { IndicateMistakeForm } from "./IndicateMistakeForm";
import { MultipleChoiceForm } from "./MultipleChoiceForm";
import { SingleChoiceForm } from "./SingleChoiceForm";

export const QuestionForm = (props: any) => {
  const { data, onSave, isAllowToEdit = true, isView = false } = props;

  const { t } = useTranslation();

  const router = useRouter();
  const questionBankId: any = router.query.questionBankId;
  const slug = router.query.slug;
  const typeQuery = useNextQueryParam("type");
  const type = data ? data.questionType : typeQuery;
  const isNew = slug == "create";

  const [saveDisabled, setSaveDisabled] = useState(false);

  const onSubmit = (data: any) => {
    setSaveDisabled(true);
    let requestData: any = FunctionBase.parseIntValue(data, ["scoringType"]);
    requestData.neverShuffle = !requestData.neverShuffle;
    if (requestData?.loIds) {
      requestData.loIds = requestData.loIds.map((x: any) => parseInt(x));
    }
    if (onSave) {
      onSave(requestData);
    } else {
      CmsService.saveOrUpdateQuestion(requestData).then((res: any) => {
        if (res) {
          Notify.success(t("Save question successfully!"));
          redirect_back();
        } else {
          setSaveDisabled(false);
        }
      });
    }
  };

  const redirect_back = () => {
    router.push(`/cms/question-bank/${questionBankId}`);
  };

  switch (+type) {
    case QuestionTypeEnum.Multichoice:
      return (
        <MultipleChoiceForm
          data={data}
          isAllowToEdit={isAllowToEdit}
          questionBankId={questionBankId}
          isNew={isNew}
          type={type}
          onDiscard={redirect_back}
          onSave={onSubmit}
          saveDisabled={saveDisabled}
          isView={isView}
        />
      );
    case QuestionTypeEnum.SingleChoice:
    case QuestionTypeEnum.YesOrNo:
      return (
        <SingleChoiceForm
          data={data}
          isAllowToEdit={isAllowToEdit}
          questionBankId={questionBankId}
          isNew={isNew}
          type={type}
          onDiscard={redirect_back}
          onSave={onSubmit}
          saveDisabled={saveDisabled}
          isView={isView}
        />
      );
    case QuestionTypeEnum.FillInBlank:
      return (
        <FillInForm
          data={data}
          isAllowToEdit={isAllowToEdit}
          questionBankId={questionBankId}
          isNew={isNew}
          type={type}
          onDiscard={redirect_back}
          onSave={onSubmit}
          saveDisabled={saveDisabled}
          isView={isView}
        />
      );
    case QuestionTypeEnum.Matching:
      return (
        <MatchingForm
          data={data}
          isAllowToEdit={isAllowToEdit}
          questionBankId={questionBankId}
          isNew={isNew}
          type={type}
          onDiscard={redirect_back}
          onSave={onSubmit}
          saveDisabled={saveDisabled}
          isView={isView}
        />
      );
    case QuestionTypeEnum.Essay:
      return (
        <EssayForm
          data={data}
          isAllowToEdit={isAllowToEdit}
          questionBankId={questionBankId}
          isNew={isNew}
          type={type}
          onDiscard={redirect_back}
          onSave={onSubmit}
          saveDisabled={saveDisabled}
          isView={isView}
        />
      );
    case QuestionTypeEnum.Indicate:
      return (
        <IndicateMistakeForm
          data={data}
          isAllowToEdit={isAllowToEdit}
          questionBankId={questionBankId}
          isNew={isNew}
          type={type}
          onDiscard={redirect_back}
          onSave={onSubmit}
          saveDisabled={saveDisabled}
          isView={isView}
        />
      );
  }
  return <>Wrong question type</>;
};

export const handleMultipleLangQuestion = (data: any) => {
  const currentLang = data.language;
  let multiLangData = data.multiLangData || [];
  const langData = {
    key: currentLang,
    title: data.title,
    description: data.description,
  };
  const langDataOther = {
    key: currentLang == "en" ? "vn" : "en",
    title: data.title,
    description: data.description,
  };
  multiLangData = [...multiLangData.filter((e: any) => e.key !== currentLang), langData];
  if (multiLangData.length <= 1) {
    multiLangData = [...multiLangData, langDataOther];
  }
  multiLangData.forEach((e: any) => {
    if (_.isEmpty(e.title)) {
      e.title = data.title;
    }
    if (_.isEmpty(e.description)) {
      e.description = data.description;
    }
  });
  data.multiLangData = multiLangData;

  data.answers?.forEach((answer: any) => {
    const currentLang = data.language;
    let answerMultiLangData = answer.multiLangData || [];
    const langData = {
      key: currentLang,
      prompt: answer.prompt,
      feedBack: answer.feedBack,
      content: answer.content,
    };
    const langDataOther = {
      key: currentLang == "en" ? "vn" : "en",
      prompt: answer.prompt,
      feedBack: answer.feedBack,
      content: answer.content,
    };
    answerMultiLangData = [...answerMultiLangData.filter((e: any) => e.key !== currentLang), langData];
    if (answerMultiLangData.length <= 1) {
      answerMultiLangData = [...answerMultiLangData, langDataOther];
    }
    answerMultiLangData.forEach((e: any) => {
      if (_.isEmpty(e.prompt)) {
        e.prompt = answer.prompt;
      }
      if (_.isEmpty(e.feedBack)) {
        e.feedBack = answer.feedBack;
      }
      if (_.isEmpty(e.content)) {
        e.content = answer.content;
      }
    });
    answer.multiLangData = answerMultiLangData;
  });

  return data;
};
