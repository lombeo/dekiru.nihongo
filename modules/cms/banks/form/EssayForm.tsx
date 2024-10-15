import { yupResolver } from "@hookform/resolvers/yup";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage } from "@src/helpers/helper";
import { Form, FormActionButton } from "components/cms";
import { AlertBox } from "components/cms/core/AlertBox";
import { Visible } from "components/cms/core/Visible";
import { NotificationLevel } from "constants/cms/common.constant";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { ReadingQuestionFormSchema } from "validations/cms/question.schemal";
import { QuestionBaseInput } from "../question/QuestionBaseInput";
import { handleMultipleLangQuestion } from "./QuestionForm";

let deletedAnswers: any = [];
export const EssayForm = (props: any) => {
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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ReadingQuestionFormSchema),
    defaultValues: {
      id: data?.id,
      title: data ? resolveLanguage(data, locale)?.title : "",
      description: data ? resolveLanguage(data, locale)?.description : "",
      multiLangData: data ? data.multiLangData : [],
      language: keyLocale,
      level: data ? data.level.toString() : "1",
      mark: data ? data.mark : 0,
      tags: data ? data.tags : [],
      answers: [
        {
          uid: uuidv4(),
          content: "",
          isCorrect: true,
          isDeleted: false,
          feedback: "",
        },
      ],
      questionType: parseInt(type as string),
      bankId: questionBankId,
      neverShuffle: data ? !data.neverShuffle : true,
      scoringType: data ? data.scoringType : "0",
      loIds: data ? data.lOs.map((x: any) => x.id.toString()) : [],
    },
  });

  const onClickSave = (data: any) => {
    let requestData = { ...data };

    requestData.title = FunctionBase.normalizeSpace(data.title);

    const requestDataWithDeletedArray = {
      ...handleMultipleLangQuestion(requestData),
      deletedList: deletedAnswers,
    };
    onSave?.(requestDataWithDeletedArray);
  };

  return (
    <Form onSubmit={handleSubmit(onClickSave)}>
      <QuestionBaseInput watch={watch} register={register} control={control} errors={errors} setValue={setValue}>
        <AlertBox message={t(errors.mark?.message as any)} type={NotificationLevel.ERROR} />
      </QuestionBaseInput>
      <Visible visible={isAllowToEdit && !isView}>
        <FormActionButton saveDisabled={saveDisabled} onDiscard={onDiscard} />
      </Visible>
    </Form>
  );
};
