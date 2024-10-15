import { ActionIcon, Select, Table } from "@mantine/core";
import { InputDescription, InputDuration, InputPoint, InputTags, InputTitle } from "@src/components/cms";
import { InputLevelId } from "@src/components/cms/widgets/form/InputLevelId";
import { Visible } from "components/cms/core/Visible";
import { InputVisibility } from "components/cms/widgets/form/InputVisibility";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { Plus, X } from "tabler-icons-react";
import ModalAddUser from "./ModalAddUser";

interface ActivityBaseInputProps {
  register: any;
  control: any;
  errors: any;
  setValue: any;
  visibleTitle?: boolean;
  visibleTags?: boolean;
  visibleDescription?: boolean;
  visibleVisibility?: boolean;
  visibleDuration?: boolean;
  visiblePoint?: boolean;
  visibleLevelId?: boolean;
  requiredTitle?: boolean;
  requiredTags?: boolean;
  requiredDescription?: boolean;
  requiredPoint?: boolean;
  requiredLevelId?: boolean;
  hiddenLanguage?: boolean;
  hiddenShareUser?: boolean;
  children?: any;
  labels?: {
    title: any;
    description: any;
    tags: any;
    duration: any;
    point: any;
    levelId: any;
  };
  descriptionName?: any;
  watch: any;
  disabled?: boolean;
}

export const ActivityBaseInput = (props: ActivityBaseInputProps) => {
  const {
    register,
    control,
    errors,
    setValue,
    visibleTitle = true,
    visibleTags = true,
    visibleDescription = true,
    visibleVisibility = false,
    visibleDuration = true,
    visiblePoint = false,
    visibleLevelId = false,
    requiredTitle = true,
    requiredTags = false,
    requiredDescription = false,
    requiredPoint = true,
    requiredLevelId = true,
    children = null,
    labels,
    descriptionName,
    watch,
    hiddenLanguage,
    hiddenShareUser,
    disabled,
  } = props;

  const { t } = useTranslation();

  const durationTitleDefault = "Duration (minutes)";
  const pointTitleDefault = "Points";

  const handleChangeLang = (value: string) => {
    const preLang = watch("language");
    if (value === preLang) return;
    let multiLangData = watch("multiLangData") || [];
    const data = {
      key: preLang,
      title: watch("title"),
      description: watch("description"),
    };
    multiLangData = multiLangData.filter((e: any) => e.key !== preLang);
    setValue("multiLangData", [...multiLangData, data]);
    const dataLang = multiLangData.find((e: any) => e.key === value);
    setValue("title", dataLang?.title ?? "");
    setValue("description", dataLang?.description ?? "");
    setValue("language", value);
  };

  const listActivityUsersField = useFieldArray({
    control,
    name: "activityUsers",
  });

  const [openModalAddUser, setOpenModalAddUser] = useState(false);

  return (
    <>
      {openModalAddUser && (
        <ModalAddUser
          onSuccess={(value: any) => {
            const activityUsers = watch("activityUsers") || [];
            activityUsers.forEach((e: any) => {
              if (value?.some((user: any) => user.userId === e.userId)) {
                e.isDeleted = false;
              }
            });
            setValue("activityUsers", _.unionBy([...activityUsers, ...value], "userId"));
          }}
          onClose={() => setOpenModalAddUser(false)}
        />
      )}
      <Visible visible={!hiddenLanguage}>
        <Controller
          name="language"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              data={[
                { label: "Tiếng Việt", value: "vn" },
                { label: "English", value: "en" },
              ]}
              size="md"
              label={t("Language")}
              placeholder={t("Choose a language")}
              required
              error={errors[field.name]?.message as any}
              onChange={handleChangeLang}
            />
          )}
        />
      </Visible>
      <Visible visible={visibleTitle}>
        <InputTitle
          disabled={disabled}
          register={register}
          errors={errors}
          required={requiredTitle}
          label={labels?.title}
        />
      </Visible>
      <Visible visible={visibleVisibility}>
        <InputVisibility
          disabled={disabled}
          setValue={setValue}
          errors={errors}
          control={control}
          required={requiredTags}
        />
      </Visible>
      <Visible visible={visibleDuration}>
        <InputDuration
          disabled={disabled}
          label={labels?.duration || durationTitleDefault}
          register={register}
          errors={errors}
          required={requiredTitle}
          watch={watch}
          setValue={setValue}
          control={control}
        />
      </Visible>

      <Visible visible={visiblePoint}>
        <InputPoint
          disabled={disabled}
          label={labels?.point || pointTitleDefault}
          register={register}
          errors={errors}
          required={requiredPoint}
          watch={watch}
          setValue={setValue}
          control={control}
        />
      </Visible>

      <Visible visible={visibleLevelId}>
        <InputLevelId
          disabled={disabled}
          register={register}
          errors={errors}
          required={requiredLevelId}
          watch={watch}
          setValue={setValue}
          control={control}
        />
      </Visible>

      <Visible visible={visibleTags}>
        <InputTags
          disabled={disabled}
          setValue={setValue}
          errors={errors}
          control={control}
          required={requiredTags}
          label={labels?.tags}
        />
      </Visible>

      <Visible visible={visibleDescription}>
        <InputDescription
          disabled={disabled}
          control={control}
          name={descriptionName}
          errors={errors}
          required={requiredDescription}
          label={labels?.description}
        />
      </Visible>

      <Visible visible={children}>{children}</Visible>

      <Visible visible={!hiddenShareUser}>
        <div className="my-5">
          <div className="flex gap-4 items-center">
            <div>{t("List shared users")}</div>
            {!disabled && (
              <ActionIcon onClick={() => setOpenModalAddUser(true)} color="blue" variant="filled" size="sm">
                <Plus />
              </ActionIcon>
            )}
          </div>
          <div className="mt-4 border">
            <Table>
              <thead>
                <tr>
                  <th>{t("Name")}</th>
                  {!disabled && <th className="w-[68px]"></th>}
                </tr>
              </thead>
              <tbody>
                {listActivityUsersField.fields.map((field: any, index: number) => {
                  if (field.isDeleted) return null;
                  return (
                    <tr key={field.id}>
                      <td>{field.userName}</td>
                      {!disabled && (
                        <td>
                          <ActionIcon
                            onClick={() =>
                              listActivityUsersField.update(index, {
                                ..._.omit(field, "id"),
                                isDeleted: true,
                              })
                            }
                          >
                            <X />
                          </ActionIcon>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </Visible>
    </>
  );
};
