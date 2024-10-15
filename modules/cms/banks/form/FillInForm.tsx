import { yupResolver } from "@hookform/resolvers/yup";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage } from "@src/helpers/helper";
import { QuestionHelper } from "@src/helpers/question.helper";
import { Form, FormActionButton } from "components/cms";
import { AlertBox } from "components/cms/core/AlertBox";
import { Visible } from "components/cms/core/Visible";
import { NotificationLevel } from "constants/cms/common.constant";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { FillInQuestionFormSchema } from "validations/cms/question.schemal";
import { InputFillInAnswerOptionsSetting } from "../../activities/components/fill-in/InputFillInAnswerOptionsSetting";
import { QuestionBaseInput } from "../question/QuestionBaseInput";
import { handleMultipleLangQuestion } from "./QuestionForm";

let deletedAnswers: any = [];
export const FillInForm = (props: any) => {
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
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(FillInQuestionFormSchema),
    defaultValues: {
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
        ? QuestionHelper.preAnswersData(data.answers, locale)
        : [
            {
              uid: uuidv4(),
              content: "",
              isCorrect: true,
              isDeleted: false,
              feedback: "",
              raws: [
                {
                  text: "",
                },
              ],
            },
          ],
      questionType: parseInt(type as string),
      bankId: questionBankId,
      neverShuffle: data ? !data.neverShuffle : true,
      scoringType: data ? data.scoringType : "0",
      loIds: data ? data.lOs.map((x: any) => x.id.toString()) : [],
    },
  });

  const onAddNewAnswer = () => {
    let answerArr: any = getValues("answers");
    answerArr.push({
      uid: uuidv4(),
      content: "",
      isCorrect: true,
      feedback: "",
      isDeleted: false,
      raws: [
        {
          text: "",
        },
      ],
    });
    setValue("answers", answerArr);
    setError(`answers`, {});
  };

  //   const onAddNewAnswerOption = (uid: any) => {
  //     let answerArr: any = getValues('rawAnswers')
  //     let rawAnswerArr: any = getValues('rawAnswers')
  //     let currentOptionIndex = ra

  //     answerArr.push({
  //       content: '',
  //       isCorrect: true,
  //       feedback: '',
  //       isDeleted: false,
  //     })
  //     setValue('answers', answerArr)
  //   }

  const onRemoveAnswer = (index: any) => {
    let answerArr: any = getValues("answers");
    if (answerArr[index].id) {
      deletedAnswers.push(answerArr[index].id);
    }
    answerArr.splice(index, 1);
    setError(`answers`, {});
    setValue("answers", answerArr);
  };

  const onClickSave = (data: any) => {
    let requestData = { ...data };
    requestData.title = FunctionBase.normalizeSpace(data.title);

    let answers = requestData.answers;
    answers = answers.map((x: any) => {
      return {
        ...x,
        content: x.raws.map((y: any) => y.text).join("###"),
      };
    });
    requestData.answers = answers;

    const requestDataWithDeletedArray = {
      ...handleMultipleLangQuestion(requestData),
      deletedList: deletedAnswers,
    };
    onSave?.(requestDataWithDeletedArray);
  };

  return (
    <Form onSubmit={handleSubmit(onClickSave)}>
      <QuestionBaseInput
        disabled={!isAllowToEdit}
        watch={watch}
        register={register}
        control={control}
        errors={errors}
        setValue={setValue}
      >
        <AlertBox message={t(errors.mark?.message as any)} type={NotificationLevel.ERROR} />
        <InputFillInAnswerOptionsSetting
          register={register}
          errors={errors}
          data={getValues("answers")}
          control={control}
          onAddNew={onAddNewAnswer}
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
