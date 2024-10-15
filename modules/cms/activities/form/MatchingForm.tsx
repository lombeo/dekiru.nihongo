import { yupResolver } from "@hookform/resolvers/yup";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage } from "@src/helpers/helper";
import { QuestionHelper } from "@src/helpers/question.helper";
import { Form, FormActionButton } from "components/cms";
import { AlertBox } from "components/cms/core/AlertBox";
import { Visible } from "components/cms/core/Visible";
import { NotificationLevel } from "constants/cms/common.constant";
import { QuestionBaseInput } from "modules/cms/banks/question/QuestionBaseInput";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { MatchingQuestionFormSchema } from "validations/cms/question.schemal";
import { handleMultipleLangQuestion } from "../../banks/form/QuestionForm";
import { InputMatchingAnswerOptionsSetting } from "../components/matching/InputMatchingAnswerOptionsSetting";

let deletedAnswers: any = [];
export const MatchingForm = (props: any) => {
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

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(MatchingQuestionFormSchema),
    defaultValues: {
      id: data?.id,
      title: data ? resolveLanguage(data, locale)?.title : "",
      description: data ? resolveLanguage(data, locale)?.description : "",
      multiLangData: data ? data.multiLangData : [],
      language: keyLocale,
      mark: data ? data.mark : 0,
      tags: data ? data.tags : [],
      old_answers: QuestionHelper.getMatchingAnswersData(data?.answers ?? [], locale),
      answers: data
        ? QuestionHelper.getMatchingAnswersData(data.answers, locale)
        : [
            {
              uid: uuidv4(),
              prompt: "",
              content: "",
              isCorrect: true,
              isDeleted: false,
              isPair: true,
            },
          ],
      questionType: parseInt(type as string),
      bankId: questionBankId,
      neverShuffle: data ? !data.neverShuffle : true,
      scoringType: data ? data.scoringType : "0",
      loIds: data ? data.lOs.map((x: any) => x.id.toString()) : [],
      point: data?.point || 100,
      levelId: +data?.levelId || 1,
    },
  });

  const onAddNewPair = () => {
    let answerArr: any = getValues("answers");
    answerArr.push({
      uid: uuidv4(),
      prompt: "",
      content: "",
      isCorrect: true,
      isDeleted: false,
      isPair: true,
    });
    setValue("answers", answerArr);
  };

  const onAddNewAnswer = () => {
    let answerArr: any = getValues("answers");
    answerArr.push({
      uid: uuidv4(),
      prompt: uuidv4(),
      content: "",
      isCorrect: true,
      isDeleted: false,
      isPair: false,
    });
    setValue("answers", answerArr);
  };

  const onRemoveAnswer = (index: any) => {
    let answerArr: any = getValues("answers");
    if (answerArr[index].id) {
      deletedAnswers.push(answerArr[index].id);
    }
    answerArr.splice(index, 1);
    setValue("answers", answerArr);
    //Clear errors
    clearErrors(`answers`);
  };

  const onClickSave = (data: any) => {
    let requestData = { ...data };
    requestData.title = FunctionBase.normalizeSpace(requestData.title);

    const requestDataWithDeletedArray = {
      ...handleMultipleLangQuestion(requestData),
      deletedList: deletedAnswers,
    };

    let responseAnswers = requestDataWithDeletedArray.answers;
    responseAnswers = responseAnswers.map((x: any) => {
      return {
        ...x,
        prompt: !x.isPair ? "" : x.prompt,
      };
    });

    const responseSaveParams = {
      ...requestDataWithDeletedArray,
      answers: responseAnswers,
    };
    onSave?.(responseSaveParams);
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
        visibleScoringType
        disabled={!isAllowToEdit}
      >
        <AlertBox message={t(errors.mark?.message as any)} type={NotificationLevel.ERROR} />
        <InputMatchingAnswerOptionsSetting
          register={register}
          errors={errors}
          data={watch("answers")}
          control={control}
          watch={watch}
          onAddNewPair={onAddNewPair}
          onAddNewAnswer={onAddNewAnswer}
          onDelete={onRemoveAnswer}
          setValue={setValue}
          disabled={!isAllowToEdit}
        />
      </QuestionBaseInput>
      <Visible visible={isAllowToEdit && !isView}>
        <FormActionButton saveDisabled={saveDisabled} onDiscard={onDiscard} />
      </Visible>
    </Form>
  );
};
