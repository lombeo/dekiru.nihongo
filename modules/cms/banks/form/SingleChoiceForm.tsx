import { yupResolver } from "@hookform/resolvers/yup";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage } from "@src/helpers/helper";
import { Form, FormActionButton } from "components/cms";
import { AlertBox } from "components/cms/core/AlertBox";
import { Visible } from "components/cms/core/Visible";
import { NotificationLevel } from "constants/cms/common.constant";
import { QuestionTypeEnum } from "constants/cms/question-bank/question.constant";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { QuestionSingleChoiceSchema } from "validations/cms/question.schemal";
import { InputSingleChoiceSetting } from "../question/InputSingleChoiceSetting";
import { InputYesOrSetting } from "../question/InputYesOrNoSetting";
import { QuestionBaseInput } from "../question/QuestionBaseInput";
import { handleMultipleLangQuestion } from "./QuestionForm";

let deletedAnswers: any = [];
export const SingleChoiceForm = (props: any) => {
  const {
    data,
    questionBankId,
    type,
    onSave,
    onDiscard,
    isAllowToEdit = true,
    saveDisabled = false,
    isView = false,
  } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const defaultValues = {
    id: data?.id,
    title: data ? resolveLanguage(data, locale)?.title : "",
    description: data ? resolveLanguage(data, locale)?.description : "",
    multiLangData: data ? data.multiLangData : [],
    language: keyLocale,
    level: data ? data.level.toString() : "1",
    mark: data ? data.mark : 0,
    tags: data ? data.tags : [],
    old_answers: data?.answers,
    answers: data
      ? data.answers?.map((answer: any) => ({
          ...answer,
          content: resolveLanguage(answer, locale)?.content,
        }))
      : [
          {
            uniqueId: uuidv4(),
            content: parseInt(type as string) == QuestionTypeEnum.YesOrNo ? (locale === "vi" ? "Đúng" : "True") : "",
            isCorrect: true,
            feedback: "",
            multiLangData:
              parseInt(type as string) == QuestionTypeEnum.YesOrNo
                ? [
                    { key: "en", content: "True" },
                    { key: "vn", content: "Đúng" },
                  ]
                : [],
          },
          {
            uniqueId: uuidv4(),
            content: parseInt(type as string) == QuestionTypeEnum.YesOrNo ? (locale === "vi" ? "Sai" : "False") : "",
            isCorrect: false,
            feedback: "",
            multiLangData:
              parseInt(type as string) == QuestionTypeEnum.YesOrNo
                ? [
                    { key: "en", content: "False" },
                    { key: "vn", content: "Sai" },
                  ]
                : [],
          },
        ],
    questionType: parseInt(type as string),
    bankId: questionBankId,
    neverShuffle: data ? !data.neverShuffle : true,
    scoringType: data ? data.scoringType : "0",
    loIds: data ? data.lOs.map((x: any) => x.id.toString()) : [],
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(QuestionSingleChoiceSchema),
    defaultValues,
  });

  const onSelectCorrect = (index: any) => {
    const listAnswer = getValues("answers");
    let i = 0;
    listAnswer[index].isCorrect = true;
    for (i; i < listAnswer.length; i++) {
      if (i == index) {
        continue;
      }
      listAnswer[i].isCorrect = false;
    }
    setValue("answers", listAnswer);
  };

  const onRemoveAnswer = (index: any) => {
    let answerArr: any = getValues("answers");
    if (answerArr[index].id) {
      deletedAnswers.push(answerArr[index].id);
    }
    answerArr.splice(index, 1);
    setValue("answers", answerArr);
  };

  const onClickSave = (data: any) => {
    let requestData = { ...data };
    requestData.title = FunctionBase.normalizeSpace(requestData.title);

    const requestDataWithDeletedArray = {
      ...handleMultipleLangQuestion(requestData),
      deletedList: deletedAnswers,
    };
    onSave?.(requestDataWithDeletedArray);
  };

  const onAddNewAnswer = () => {
    let answerArr: any = getValues("answers");
    answerArr.push({
      uniqueId: uuidv4(),
      content: "",
      isCorrect: false,
      feedback: "",
    });
    setValue("answers", answerArr);
  };

  return (
    <Form onSubmit={handleSubmit(onClickSave)}>
      <QuestionBaseInput
        watch={watch}
        register={register}
        control={control}
        errors={errors}
        setValue={setValue}
        visibleNeverShuffle={true}
        disabled={!isAllowToEdit}
      >
        {type == QuestionTypeEnum.YesOrNo && (
          <>
            <AlertBox message={t(errors.mark?.message as any)} type={NotificationLevel.ERROR} />
            <InputYesOrSetting
              register={register}
              locale={watch("language") === "vn" ? "vi" : "en"}
              data={watch("answers")}
              onAddNew={onAddNewAnswer}
              onCheck={onSelectCorrect}
              onDelete={onRemoveAnswer}
              errors={errors}
              disabled={!isAllowToEdit}
            />
            <AlertBox message={t(errors.answers?.message as any)} type={NotificationLevel.ERROR} />
          </>
        )}
        {type == QuestionTypeEnum.SingleChoice && (
          <>
            <AlertBox message={t(errors.mark?.message as any)} type={NotificationLevel.ERROR} />
            <InputSingleChoiceSetting
              register={register}
              control={control}
              data={watch("answers")}
              onAddNew={onAddNewAnswer}
              onCheck={onSelectCorrect}
              onDelete={onRemoveAnswer}
              errors={errors}
              disabled={!isAllowToEdit}
            />
            <AlertBox message={t(errors.answers?.message as any)} type={NotificationLevel.ERROR} />
          </>
        )}
      </QuestionBaseInput>
      <Visible visible={isAllowToEdit && !isView}>
        <FormActionButton saveDisabled={saveDisabled} onDiscard={onDiscard} />
      </Visible>
    </Form>
  );
};
