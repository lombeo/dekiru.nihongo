import { Table } from "@mantine/core";
import { NotificationLevel } from "@src/constants/cms/common.constant";
import {
  ActionIcon,
  InputDuration,
  InputLevel,
  InputPoint,
  InputTags,
  MultiSelect,
  NumberInput,
  Select,
  Textarea,
  TextInput,
  ValidationNotification,
} from "components/cms";
import { RichEditor } from "components/cms/core/RichText/RichEditor";
import { Visible } from "components/cms/core/Visible";
import { ActivityCodeTypeEnum } from "constants/cms/activity-code/activity-code.constant";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { Plus, X } from "tabler-icons-react";
import ModalAddUser from "../../activities/components/ModalAddUser";
import { InputArgument } from "../components";
import { ImportFileTestCase } from "../components/ImportFileTestCase";
import { SQLInputArgument } from "../components/SQLInputArgument";

export const ActivityCodeBaseInput = (props: any) => {
  const { register, disabled, control, errors, subType, onAddNewSQLArg, actionType, watch, setValue, settings } = props;

  const { t } = useTranslation();

  const [listDataType, setListDataType] = useState<any>([]);
  const [listGenerateCodeType, setListGenerateCodeType] = useState<any>([]);
  const [listLevel, setListLevel] = useState<any>([]);
  const [listMemory, setListMemory] = useState<any>([]);
  const [listProgramingLanguage, setListProgramingLanguage] = useState<any>([]);
  const [openModalAddUser, setOpenModalAddUser] = useState(false);

  const getListInputDOM = () => {
    if (subType == ActivityCodeTypeEnum.Code || subType == ActivityCodeTypeEnum.Scratch)
      return (
        <InputArgument
          watch={watch}
          setValue={setValue}
          data={watch("listInputs")}
          errors={errors}
          listDataTypes={listDataType}
          control={control}
          register={register}
          disabled={disabled}
        />
      );
    if (subType == ActivityCodeTypeEnum.SQL)
      return actionType == "edit" ? (
        <SQLInputArgument
          errors={errors}
          register={register}
          onAddNewSQLArg={onAddNewSQLArg}
          data={watch("listInputs")}
          watch={watch}
          setValue={setValue}
          disabled={disabled}
        />
      ) : (
        <></>
      );
  };

  useEffect(() => {
    if (settings && Object.keys(settings).length) {
      setListDataType(
        settings["listDataType"]?.map((item: any) => {
          return {
            value: item.id,
            label: item.name,
            defaultValue: item.defaultValue,
          };
        }) || []
      );
      setListGenerateCodeType(
        settings["listGenerateCodeType"]?.map((item: any) => {
          return { value: item.id, label: item.name };
        }) || []
      );
      setListLevel(
        settings["listLevel"]?.map((item: any) => {
          return { value: item.id, label: item.name };
        }) || []
      );
      setListMemory(
        settings["listMemory"]?.map((item: any) => {
          return { value: item.id, label: item.name };
        }) || []
      );
      if (subType == ActivityCodeTypeEnum.SQL) {
        setListProgramingLanguage(
          settings["listSQLLanuage"]?.map((item: any) => {
            return { value: item.id, label: item.name };
          }) || []
        );
        setValue("programingLanguages", settings["listSQLLanuage"]?.map((item: any) => item.id) || []);
      } else {
        setListProgramingLanguage(
          settings["listProgramingLanguage"]?.map((item: any) => {
            return { value: item.id, label: item.name };
          }) || []
        );
        if (actionType == "create" && subType == ActivityCodeTypeEnum.Code)
          setValue("programingLanguages", settings["listProgramingLanguage"]?.map((item: any) => item.id) || []);

        if (actionType == "create" && subType == ActivityCodeTypeEnum.Scratch)
          setValue("programingLanguages", ["scratch"]);

        if (actionType == "create" && subType == ActivityCodeTypeEnum.OOP) {
          setValue("programingLanguages", settings["listProgramingLanguage"][0]?.value);
        }
      }
    }
  }, [settings]);

  const isNumberKey = (charCode: number) => !(charCode < 48 || charCode > 57);
  const lettersUpperOnly = (charCode: number) => charCode > 64 && charCode < 91;
  const lettersLowerOnly = (charCode: number) => charCode > 96 && charCode < 123;

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

  return (
    <div className="flex flex-col gap-5">
      {openModalAddUser && (
        <ModalAddUser
          onSuccess={(value: any) => {
            const activityUsers = watch("activityUsers") || [];
            activityUsers.forEach((e: any) => {
              if (value?.some((user: any) => user.userId === e.userId)) {
                e.isDeleted = false;
              }
            });
            setValue("activityUsers", _.unionBy([...(watch("activityUsers") || []), ...value], "userId"));
          }}
          onClose={() => setOpenModalAddUser(false)}
        />
      )}
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

      <TextInput
        label={t("Title")}
        size="md"
        {...register("title")}
        error={t(errors?.title && (errors.title?.message as any))}
        required
        readOnly={disabled}
      />

      <InputDuration
        label={t("Duration (minutes)")}
        register={register}
        errors={errors}
        required
        watch={watch}
        setValue={setValue}
        control={control}
        disabled={disabled}
      />

      <InputPoint
        label={t("Point")}
        register={register}
        errors={errors}
        required
        watch={watch}
        setValue={setValue}
        control={control}
        disabled={disabled}
      />

      <InputLevel
        label={t("Level")}
        register={register}
        errors={errors}
        required
        watch={watch}
        setValue={setValue}
        control={control}
        disabled={disabled}
      />

      <Visible visible={subType == ActivityCodeTypeEnum.Code}>
        <div className="mb-5">
          <TextInput
            label={t("Function name")}
            size="md"
            {...register("functionName")}
            error={t(errors?.functionName && (errors.functionName?.message as any))}
            required
            readOnly={disabled}
            // onKeyPress={(event) => functionNameOnchange(event)}
          />
          <div className="pt-1 italic" style={{ color: "grey", fontSize: "14px" }}>
            {`${t("Rule")}: ${t("first letter is alphabet, rest of letters not contains spaces")}`}
          </div>
        </div>
      </Visible>
      <InputTags
        errors={errors}
        control={control}
        setValue={setValue}
        label={t("Tags")}
        name="tags"
        {...register("tags")}
        onChange={() => {}}
        disabled={disabled}
      />
      <Visible visible={subType == ActivityCodeTypeEnum.Code}>
        <Controller
          name="generationCodeType"
          control={control}
          render={({ field }) => {
            return (
              <Select
                label={t("Task type")}
                {...field}
                size="md"
                readOnly={disabled}
                data={listGenerateCodeType}
                value={field.value ? field.value.toString() : listGenerateCodeType[0]?.value}
              />
            );
          }}
        />
      </Visible>
      <Visible visible={subType != ActivityCodeTypeEnum.OOP && subType != ActivityCodeTypeEnum.Scratch}>
        <Textarea label={t("Sample code")} size="md" minRows={10} {...register("codeSample")} readOnly={disabled} />
      </Visible>
      <Textarea label={t("Summary")} minRows={5} size="md" {...register("summary")} readOnly={disabled} />
      <div>
        <div>
          {t("Description")} <span className="text-red-500">*</span>
        </div>
        <Controller
          name={"description"}
          control={control}
          render={({ field }) => <RichEditor {...field} disabled={disabled} />}
        />
        <ValidationNotification
          message={t((errors["description"]?.message as any) || "")}
          type={NotificationLevel.ERROR}
        />
      </div>
      <Visible visible={subType != ActivityCodeTypeEnum.OOP && subType != ActivityCodeTypeEnum.Scratch}>
        <Textarea label={t("Verify code")} minRows={5} size="md" {...register("verifyCode")} readOnly={disabled} />
      </Visible>
      {/* <div className="mb-5">
        <TextInput
          label={t('Point')}
          size='md'
          type='number'
          step={1}
          {...register("point")}
          error={errors?.point && errors.point?.message}
          required
        />
      </div> */}
      <div>
        <NumberInput
          label={t("Limit number of submissions")}
          size="md"
          type="number"
          step={1}
          {...register("limitNumberSubmission")}
          onChange={(value: any) => setValue("limitNumberSubmission", value)}
          defaultValue={watch("limitNumberSubmission")}
          error={t(errors?.limitNumberSubmission && (errors.limitNumberSubmission?.message as any))}
          value={watch("limitNumberSubmission")}
          required
          min={0}
          max={30}
          readOnly={disabled}
          hideControls={disabled}
        />
        <div className="pt-1 italic" style={{ color: "grey", fontSize: "14px" }}>
          {t("Min value is 0, max is 30")}
        </div>
      </div>
      <TextInput
        label={t("Limit coding characters")}
        size="md"
        type="number"
        step={1}
        {...register("limitCodeCharacter")}
        error={t(errors?.limitCodeCharacter && (errors.limitCodeCharacter?.message as any))}
        required
        readOnly={disabled}
      />
      <Controller
        name="maxMemory"
        control={control}
        defaultValue={listMemory[0]?.value}
        render={({ field }) => {
          return (
            <Select
              label={t("Max memory")}
              {...field}
              size="md"
              data={listMemory}
              defaultValue={listMemory[0]?.value}
              value={field.value ? field.value.toString() : listMemory[0]?.value}
              readOnly={disabled}
            />
          );
        }}
      />
      <Visible visible={subType == ActivityCodeTypeEnum.Code || subType == ActivityCodeTypeEnum.SQL}>
        <Controller
          name="programingLanguages"
          control={control}
          render={({ field }) => {
            return (
              <MultiSelect
                label={t("Language support")}
                {...field}
                size="md"
                data={listProgramingLanguage}
                error={t(errors?.programingLanguages && (errors.programingLanguages?.message as any))}
                value={field.value ? field.value : []}
                required
                readOnly={disabled}
              />
            );
          }}
        />
      </Visible>
      <Visible visible={subType == ActivityCodeTypeEnum.OOP}>
        <Controller
          name="programingLanguages"
          control={control}
          render={({ field }) => {
            return (
              <Select
                label={t("Language support")}
                {...field}
                size="md"
                defaultValue={listProgramingLanguage[0]?.value}
                data={listProgramingLanguage}
                value={field.value ? field.value.toString() : listProgramingLanguage[0]?.value}
                readOnly={disabled}
              />
            );
          }}
        />
      </Visible>
      {/* <div className="mb-5">
        
        <Controller
          name="level"
          control={control}
          render={({ field }) => {
            return (
              <Select
                label={t("Level")}
                {...field}
                size="md"
                data={listLevel}
                value={
                  field.value
                    ? field.value.toString()
                    : listLevel[0]?.value
                }
              />
            )
          }}
        />
      </div> */}
      {/* File import */}
      <Visible visible={subType == ActivityCodeTypeEnum.SQL}>
        <ImportFileTestCase actionType={actionType} setValue={setValue} register={register} error={errors} />
      </Visible>
      {getListInputDOM()}
      <Visible visible={subType == ActivityCodeTypeEnum.Code || subType == ActivityCodeTypeEnum.Scratch}>
        <Controller
          name="outputType"
          control={control}
          render={({ field }) => {
            return (
              <Select
                label={t("Output type")}
                {...field}
                size="md"
                data={listDataType}
                value={field.value ? field.value.toString() : listDataType[0]?.value}
                disabled={disabled}
              />
            );
          }}
        />
      </Visible>
      <Visible visible={subType == ActivityCodeTypeEnum.OOP}>
        <Textarea
          label={t("Imported Libs")}
          minRows={5}
          size="md"
          {...register("oopActivity.importedLibs")}
          readOnly={disabled}
        />
        <Textarea
          label={t("Global variables")}
          minRows={5}
          size="md"
          {...register("oopActivity.globalVariables")}
          readOnly={disabled}
        />
        <Textarea
          label={t("Common methods")}
          minRows={5}
          size="md"
          {...register("oopActivity.commonMethods")}
          readOnly={disabled}
        />
      </Visible>
      <Visible visible={subType == ActivityCodeTypeEnum.Code}>
        <TextInput
          label={t("Compiler url")}
          size="md"
          {...register("extenalCompilerURL")}
          error={t(errors?.extenalCompilerURL && (errors.extenalCompilerURL?.message as any))}
          readOnly={disabled}
        />
      </Visible>
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
                {/* <th>{t("Role")}</th> */}
                {!disabled && <th className="w-[68px]"></th>}
              </tr>
            </thead>
            <tbody>
              {listActivityUsersField.fields.map((field: any, index: number) => {
                if (field.isDeleted) return null;
                return (
                  <tr key={field.id}>
                    <td>{field.userName}</td>
                    {/* <td>{t("Viewer")}</td> */}
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
    </div>
  );
};
