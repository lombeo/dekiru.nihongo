import { Button, Modal, NumberInput, Text } from "@edn/components";
import { Group } from "@edn/components/Group";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import Icon from "@edn/font-icons/icon";
import { yupResolver } from "@hookform/resolvers/yup";
import { Image, TextInput } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import Avatar from "@src/components/Avatar";
import { fileType } from "@src/config";
import { UserLevelSettingType } from "@src/constants/avatar.constant";
import { IdentityService } from "@src/services/IdentityService";
import { UploadService } from "@src/services/UploadService/UploadService";
import _, { isNil } from "lodash";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { File } from "tabler-icons-react";
import * as yup from "yup";

const ModalUploadAvatar = (props: any) => {
  const { onClose, setting, onSuccess, initialValue } = props;
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape(
        [UserLevelSettingType.UserLevel, UserLevelSettingType.ContributorLevel].includes(initialValue.type)
          ? {
              name: yup
                .string()
                .required(t("{{name}} must not be blank", { name: t("Name") }))
                .trim(t("{{name}} must not be blank", { name: t("Name") }))
                .max(
                  256,
                  t("Please enter no more than {{count}} characters.", {
                    count: 256,
                  })
                ),
              requiredExperiencePoint: yup.lazy((value) =>
                _.isString(value)
                  ? yup
                      .string()
                      .required(t("{{name}} must not be blank", { name: t("Required experience") }))
                      .trim(t("{{name}} must not be blank", { name: t("Required experience") }))
                  : yup
                      .number()
                      .nullable()
                      .required(t("{{name}} must not be blank", { name: t("Required experience") }))
              ),
            }
          : {}
      )
    ),
    defaultValues: initialValue.isCreate
      ? { file: "", name: "", requiredExperiencePoint: "" }
      : {
          file: initialValue?.file,
          name: initialValue?.name,
          requiredExperiencePoint: initialValue?.requiredExperiencePoint,
        },
  });

  const onChangeFiles = async (files: any) => {
    const file = files?.[0];
    const isValid = validation(file);
    if (!isValid) {
      return;
    }
    const res = await UploadService.upload(file, fileType.assignmentAttach);
    if (res?.data?.success && res?.data?.data?.url) {
      setValue("file", res.data.data.url);
    } else if (res?.data?.message) {
      Notify.error(t(res?.data?.message));
    }
  };

  const validation = (file: any) => {
    let isValid = true;
    if (file.size == 0) {
      Notify.error(t("Import file size is too small or invalid, please check again"));
      isValid = false;
    }
    if (file.size > 1024 * 2000) {
      Notify.error(t("Attachment file size cannot exceed 2MB"));
      isValid = false;
    } else if (file.name.length > 100) {
      Notify.error(t("File name must not exceed 100 characters"));
      isValid = false;
    }
    return isValid;
  };

  const onFormSubmit = (event: any) => {
    event.preventDefault();
    handleSubmit(async (data) => {
      if (!data.file || data.file.trim() === "") {
        Notify.error(t("{{name}} must not be blank", { name: t("Image") }));
        return;
      }

      setLoading(true);

      let newSetting = _.cloneDeep(setting);

      if (initialValue.type === UserLevelSettingType.DefaultUserAvatar) {
        newSetting.defaultUserAvatarUrl = data.file;
      } else if (initialValue.type === UserLevelSettingType.ManagerFrame) {
        newSetting.managerFrameUrl = data.file;
      } else if (initialValue.type === UserLevelSettingType.DefaultContributorAvatar) {
        newSetting.defaultContributorAvatarUrl = data.file;
      } else if (initialValue.type === UserLevelSettingType.UserLevel) {
        if (initialValue.isCreate) {
          newSetting.userLevelSettings.push({
            id: 0,
            iconUrl: data.file,
            name: data.name,
            requiredExperiencePoint: data.requiredExperiencePoint,
          });
        } else {
          newSetting.userLevelSettings.forEach((item) => {
            if (item.id === initialValue.id) {
              item.iconUrl = data.file;
              item.name = data.name;
              item.requiredExperiencePoint = data.requiredExperiencePoint;
            }
          });
        }
      } else if (initialValue.type === UserLevelSettingType.ContributorLevel) {
        if (initialValue.isCreate) {
          newSetting.contributorLevelSettings.push({
            id: 0,
            iconUrl: data.file,
            name: data.name,
            requiredExperiencePoint: data.requiredExperiencePoint,
          });
        } else {
          newSetting.contributorLevelSettings.forEach((item) => {
            if (item.id === initialValue.id) {
              item.iconUrl = data.file;
              item.name = data.name;
              item.requiredExperiencePoint = data.requiredExperiencePoint;
            }
          });
        }
      }

      const res = await IdentityService.userLevelSettingUpdateSettings(newSetting);
      setLoading(false);
      if (res?.data?.success) {
        Notify.success(t("Save successfully!"));
        onSuccess?.();
        onClose();
      } else if (res?.data?.message) {
        Notify.error(t(res.data.message));
      }
    })();
  };

  return (
    <>
      <Modal
        classNames={{ title: "font-semibold text-xl" }}
        title={t("Upload image")}
        size="lg"
        opened
        onClose={onClose}
      >
        <form className="mt-6 space-y-4" onSubmit={onFormSubmit} noValidate>
          {[UserLevelSettingType.UserLevel, UserLevelSettingType.ContributorLevel].includes(initialValue.type) && (
            <div className="flex flex-col gap-4">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextInput {...field} required error={errors[field.name]?.message as string} label={t("Name")} />
                )}
              />
              <Controller
                name="requiredExperiencePoint"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    label={t("Required experience")}
                    hideControls
                    min={0}
                    max={1000000000}
                    required
                    error={errors[field.name]?.message as any}
                    value={isNil(field.value) ? "" : field.value}
                    {...field}
                  />
                )}
              />
            </div>
          )}
          <Dropzone
            multiple={false}
            onDrop={(files) => onChangeFiles(files)}
            onReject={(files) => console.log("rejected files", files)}
            accept={IMAGE_MIME_TYPE}
          >
            <Group position="center" spacing="sm" style={{ height: 50, pointerEvents: "none" }}>
              <span className="text-blue-primary">
                <Icon name="upload-cloud" size={30}></Icon>
              </span>
              <div className="text-blue-primary">
                <Text size="md" inline>
                  {t("Drag and drop the file, or Browse")}
                </Text>
              </div>
            </Group>
          </Dropzone>
          {watch("file") ? (
            <div className="mb-2 justify-center flex gap-2 items-center text-[#7f878f]">
              <File className="text-[#2C31CF]" />
              <TextLineCamp className="max-w-[300px] font-semibold !break-all text-blue-primary">
                {watch("file")}
              </TextLineCamp>
            </div>
          ) : null}
          <div>
            <div className="font-semibold pb-2">{t("Preview")}</div>
            {initialValue.type === UserLevelSettingType.DefaultContributorAvatar ? (
              <Image width={50} src={watch("file")} />
            ) : (
              <Avatar
                userExpLevel={
                  [UserLevelSettingType.DefaultUserAvatar].includes(initialValue.type)
                    ? null
                    : watch("file")
                    ? {
                        iconUrl: watch("file"),
                      }
                    : null
                }
                src={
                  [UserLevelSettingType.DefaultUserAvatar].includes(initialValue.type)
                    ? watch("file")
                    : "/images/white.jpeg"
                }
              />
            )}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => onClose()}>
              {t("Cancel")}
            </Button>
            <Button type="submit" loading={loading}>
              {t("Save")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ModalUploadAvatar;
