import Icon from "@edn/font-icons/icon";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { AppIcon } from "@src/components/cms/core/Icons";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { Button, Form, FormActionButton, Notify, TextInput } from "components/cms";
import { LIMIT_VIDEO_TITLE_LENGTH } from "constants/cms/video/video.constant";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const VideoForm = (props: any) => {
  const { t } = useTranslation();
  const { saveUploadVideo, onDiscard, data } = props;

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      name: data?.vodName || "",
      file: { name: "", size: 0 },
    },
  });

  const [visibleInputName, setVisibleInputName] = useState(false);

  const onChangeFiles = (files: any) => {
    const limit: number = process.env.NEXT_PUBLIC_VIDEO_MAXIMUM_UPLOAD_LIMIT
      ? parseInt(process.env.NEXT_PUBLIC_VIDEO_MAXIMUM_UPLOAD_LIMIT)
      : 0;
    if (files && files[0].size / 1024 / 1000 > limit) {
      Notify.warning(t(`Maximum upload size limit of {{limit}}MB`, { limit: limit }));
      return;
    }
    const { name } = files[0];
    setVisibleInputName(true);
    setValue("name", name);
    setValue("file", files[0]);
  };

  const onSave = (values: any) => {
    if (values && values?.file?.size == 0) {
      Notify.error(t("Please select a file to upload"));
      return;
    }
    if (values && values?.name?.length > LIMIT_VIDEO_TITLE_LENGTH) {
      Notify.error(
        t(`Title cannot exceed the limit of {{limit}} characters`, {
          limit: LIMIT_VIDEO_TITLE_LENGTH,
        })
      );
      return;
    }
    values.name = FunctionBase.normalizeSpace(values.name);
    saveUploadVideo && saveUploadVideo(values);
  };

  const onDelete = () => {
    setValue("file", { name: "", size: 0 });
    setValue("name", "");
    setVisibleInputName(false);
  };

  const { name, size } = watch("file");
  return (
    <>
      <Form onSubmit={handleSubmit(onSave)}>
        {visibleInputName && (
          <>
            <TextInput label="Name" {...register("name")} />
          </>
        )}
        <Dropzone onDrop={(files) => onChangeFiles(files)} accept={[MIME_TYPES.mp4]}>
          <div className="text-center p-20">
            <div className="flex justify-center">
              <AppIcon size="xl" name="arrow_upload" />
            </div>
            {t("Drag and drop the file, or Browse")}
          </div>
        </Dropzone>
        {name && (
          <div className="space-y-2 mb-5">
            <div className="flex justify-between items-center p-4 bg-gray-500 rounded-sm mt-2">
              <span className="font-semibold mr-2">
                {name} <span className="font-normal italic text-sm">{(size / 1024).toFixed(2)} KB</span>
              </span>
              <Button preset="primary" color="red" isSquare={true} size="xs" onClick={() => onDelete()}>
                <Icon name="delete" />
              </Button>
            </div>
          </div>
        )}

        <FormActionButton onDiscard={onDiscard} />
      </Form>
    </>
  );
};
