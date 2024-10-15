import Icon from "@edn/font-icons/icon";
import { Center, Textarea, TextInput } from "@mantine/core";
import { Button, ValidationNotification } from "components/cms";
import FormCard from "components/cms/core/FormCard/FormCard";
import { Visible } from "components/cms/core/Visible";
import { NotificationLevel } from "constants/cms/common.constant";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { Controller } from "react-hook-form";

export const InputMatchingAnswerOptionsSetting = (props: any) => {
  const { data, onAddNewPair, onAddNewAnswer, onDelete, register, errors, control, disabled } = props;

  let pairIndex = 0;
  let answerOnlyIndex = 0;

  const { t } = useTranslation();

  return (
    <>
      <FormCard className="space-y-3 border " padding={0} radius={"md"} label={t(LocaleKeys["Answer options"])}>
        {data &&
          data.map((x: any, idx: any) => {
            if (x.isPair) {
              pairIndex++;
              return (
                <FormCard.Row key={x.uid} spacing={3}>
                  <div className="grid grid-cols-12 items-baseline">
                    <div className="col-span-2 text-success font-semibold">
                      {t(LocaleKeys.D_QUESTION_PAIR_OPTION_SPECIFIC, {
                        name: pairIndex.toString(),
                      })}
                    </div>
                    <div className="col-span-10">
                      <div className="flex gap-2 items-start text-sm">
                        <div className="flex-grow">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Visible visible={x.isPair}>
                                <TextInput
                                  className="flex-grow"
                                  {...register(`answers.${idx}.prompt`, {
                                    required: "message loi",
                                  })}
                                  value={x.prompt}
                                  placeholder={t(LocaleKeys.D_ENTER_SPECIFIC, {
                                    name: t(LocaleKeys["a prompt"].toLowerCase()),
                                  })}
                                  readOnly={disabled}
                                />
                                {errors.answers && (
                                  <ValidationNotification
                                    message={t(errors.answers[idx]?.prompt?.message as any)}
                                    type={NotificationLevel.ERROR}
                                  />
                                )}
                              </Visible>
                            </div>
                            <div>
                              <TextInput
                                className="flex-grow"
                                {...register(`answers.${idx}.content`, {
                                  required: "message loi",
                                })}
                                value={x.content}
                                placeholder={t(LocaleKeys.D_ENTER_SPECIFIC, {
                                  name: t(LocaleKeys["an answer"].toLowerCase()),
                                })}
                                readOnly={disabled}
                              />
                              {errors.answers && (
                                <ValidationNotification
                                  message={t(errors.answers[idx]?.content?.message as any)}
                                  type={NotificationLevel.ERROR}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <Button
                            disabled={data?.length <= 1 || disabled}
                            preset="primary"
                            color="red"
                            isSquare={true}
                            size="sm"
                            onClick={() => onDelete(idx)}
                          >
                            <Icon name="delete" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 items-baseline">
                    <div className="col-span-2">{t(LocaleKeys["Feedback"])}</div>
                    <div className="col-span-10">
                      <Controller
                        name={`answers.${idx}.feedBack`}
                        control={control}
                        render={({ field }) => <Textarea {...field} readOnly={disabled} />}
                      />
                      {errors.answers && (
                        <ValidationNotification
                          message={t(errors.answers[idx]?.feedBack?.message as any)}
                          type={NotificationLevel.ERROR}
                        />
                      )}
                    </div>
                  </div>
                </FormCard.Row>
              );
            }
          })}

        {data &&
          data.map((x: any, idx: any) => {
            if (!x.isPair) {
              answerOnlyIndex++;
              return (
                <FormCard.Row key={x.uid} spacing={3}>
                  <div className="grid grid-cols-12 items-baseline">
                    <div className="col-span-2 font-semibold">
                      {t(LocaleKeys.D_QUESTION_ANSWER_SPECIFIC, {
                        name: answerOnlyIndex.toString(),
                      })}
                    </div>
                    <div className="col-span-10">
                      <div className="flex gap-2 items-start text-sm">
                        <div className="flex-grow">
                          <div className="grid grid-cols-2 gap-3">
                            <div></div>
                            <div>
                              <TextInput
                                className="flex-grow"
                                {...register(`answers.${idx}.content`, {
                                  required: "message loi",
                                })}
                                value={x.content}
                                placeholder={t(LocaleKeys.D_ENTER_SPECIFIC, {
                                  name: t(LocaleKeys["an answer"].toLowerCase()),
                                })}
                                readOnly={disabled}
                              />
                              {errors.answers && (
                                <ValidationNotification
                                  message={t(errors.answers[idx]?.content?.message as any)}
                                  type={NotificationLevel.ERROR}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <Button
                            disabled={data?.length <= 1 || disabled}
                            preset="primary"
                            color="red"
                            isSquare={true}
                            size="sm"
                            onClick={() => onDelete(idx)}
                          >
                            <Icon name="delete" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 items-baseline">
                    <div className="col-span-2">{t(LocaleKeys["Feedback"])}</div>
                    <div className="col-span-10">
                      <Controller
                        name={`answers.${idx}.feedBack`}
                        control={control}
                        render={({ field }) => <Textarea {...field} readOnly={disabled} />}
                      />
                      {errors.answers && (
                        <ValidationNotification
                          message={t(errors.answers[idx]?.feedBack?.message as any)}
                          type={NotificationLevel.ERROR}
                        />
                      )}
                    </div>
                  </div>
                </FormCard.Row>
              );
            }
          })}

        <Visible visible={errors.answers?.message !== undefined}>
          <FormCard.Row>
            <Center className="pt-3 pb-5">
              <ValidationNotification message={t(errors.answers?.message as any)} type={NotificationLevel.ERROR} />
            </Center>
          </FormCard.Row>
        </Visible>

        {!disabled && (
          <FormCard.Row>
            <Center className="gap-2">
              <Button onClick={onAddNewPair} preset="primary" size="sm" disabled={data?.length >= 20}>
                {t(LocaleKeys["Add a pair"])}
              </Button>
              <Button onClick={onAddNewAnswer} preset="secondary" size="sm" disabled={data?.length >= 20}>
                {t(LocaleKeys["Add an answer"])}
              </Button>
            </Center>
          </FormCard.Row>
        )}
      </FormCard>
    </>
  );
};
