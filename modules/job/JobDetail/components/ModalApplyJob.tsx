import { Button, Group, Text } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import Icon from "@edn/font-icons/icon";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionIcon, Checkbox, Modal, Radio, Select, Textarea } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import Link from "@src/components/Link";
import { fileType } from "@src/config";
import { RecruitmentService } from "@src/services/RecruitmentService/RecruitmentService.ts";
import { UploadService } from "@src/services/UploadService/UploadService";
import clsx from "clsx";
import _, { isEmpty } from "lodash";
import { Trans, useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { File, Trash } from "tabler-icons-react";
import * as yup from "yup";

const ModalApplyJob = (props: any) => {
  const { t } = useTranslation();
  const { onClose, onSuccess, data } = props;
  const initialValues: any = {
    description: "",
    type: "1",
  };

  const [cvs, setCvs] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCvs = async () => {
    const res = await RecruitmentService.cvList({ pageIndex: 1, pageSize: 10 });
    if (res?.data?.success) {
      setCvs(res.data.data);
    }
  };

  useEffect(() => {
    fetchCvs();
  }, []);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        cv1: yup
          .string()
          .nullable()
          .test(
            "requiredCv1",
            t("{{name}} must not be blank", { name: t("CV") }),
            (value, schema) => !isEmpty(value?.trim()) || schema.parent.type === "2"
          ),
        // cvUrl: yup
        //   .string()
        //   .nullable()
        //   .test(
        //     "requiredCv2",
        //     t("{{name}} must not be blank", { name: t("CV") }),
        //     (value, schema) => !isEmpty(value?.trim()) || schema.parent.type === "1"
        //   ),
        agree: yup
          .boolean()
          .nullable()
          .required(t("You have not agreed to our Terms of Service and Privacy Policy"))
          .isTrue(t("You have not agreed to our Terms of Service and Privacy Policy")),
        description: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Description") }))
          .trim(t("{{name}} must not be blank", { name: t("Description") }))
          .max(
            500,
            t("{{name}} must be less than {{count}} characters", {
              count: 500,
              name: t("Description"),
            })
          ),
      })
    ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    trigger,
  } = methodForm;

  const handleClickSubmit = async () => {
    handleSubmit(async (data) => {
      if (data.type === "2" && isEmpty(data.cvUrl?.trim())) {
        Notify.error(t("Please select your CV before submitting your application!"));
        return;
      }
      setLoading(true);
      const res = await RecruitmentService.applyJobApply({
        jobId: props.data?.id,
        description: data.description,
        cvUrl: data.type === "2" ? data.cvUrl : cvs?.find((e) => e.id == data.cv1)?.cvUrl,
      });
      setLoading(false);
      if (res?.data?.success) {
        Notify.success(t("Apply successfully!"));
        onSuccess?.();
        onClose();
      } else if (res?.data?.message) {
        Notify.error(t(res.data.message));
      }
    })();
  };

  const validation = (data: any) => {
    let isValid = true;
    const file = data[0];
    if (file.size == 0) {
      Notify.error(t("Import file size is too small or invalid, please check again"));
      isValid = false;
    }
    if (file.size > 1024 * 1000 * 5) {
      Notify.error(t("Attachment file size cannot exceed {{size}}", { size: "25MB" }));
      isValid = false;
    } else if (file.name.length > 100) {
      Notify.error(t("File name must not exceed 100 characters"));
      isValid = false;
    }
    return isValid;
  };

  const onChangeFiles = async (data: any) => {
    const isValid = validation(data);
    if (!isValid) {
      return;
    }
    const file = data[0];
    const res = await UploadService.upload(file, fileType.assignmentAttach);
    if (res.data?.success && res.data.data) {
      const url = res.data.data.url;
      setValue("fileName", file.name);
      setValue("cvUrl", url, {
        shouldValidate: true,
      });
    }
  };

  return (
    <Modal
      classNames={{ title: "font-semibold text-xl", header: "py-5 px-6", body: "py-5 px-6" }}
      size="lg"
      centered
      onClose={onClose}
      opened
      title={
        <div>
          {t("RecruitmentPage.Apply")} <span className="text-blue-primary">{data?.title}</span>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <div>
          <div className="mb-1 text-sm">
            {t("Select CV to apply")}&nbsp;
            <span className="text-red-500">*</span>
          </div>

          <div
            className={clsx("flex cursor-pointer flex-col gap-2 p-4 border hover:border-[#2C31CF] rounded-lg", {
              "border-[#2C31CF]": watch("type") === "1",
            })}
            onClick={(e) => {
              setValue("type", "1");
              trigger("cvUrl");
            }}
          >
            <Radio
              checked={watch("type") === "1"}
              onChange={() => setValue("type", "1")}
              label={t("Select another CV in my CV library")}
            />
            <Controller
              name="cv1"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  error={errors?.cv1?.message as any}
                  clearable
                  data={cvs?.map((e) => ({ value: _.toString(e.id), label: e.name })) || []}
                />
              )}
            />
          </div>

          <div
            className={clsx(
              "mt-4 relative flex cursor-pointer flex-col gap-2 border hover:border-[#2C31CF] rounded-lg",
              {
                "border-[#2C31CF]": watch("type") === "2",
              }
            )}
            onClick={(e) => {
              setValue("type", "2");
              trigger("cv1");
            }}
          >
            <Radio
              checked={watch("type") === "2"}
              className="absolute top-4 left-4 z-10"
              value="2"
              onChange={() => {
                setValue("type", "2");
                trigger("cv1");
              }}
            />
            <Dropzone
              multiple={false}
              onDrop={(files) => onChangeFiles(files)}
              onReject={(files) => console.log("rejected files", files)}
              accept={[
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/pdf",
              ]}
              classNames={{
                root: "border-none rounded-lg",
              }}
            >
              <div className="flex flex-col justify-center items-center">
                <Group position="center" spacing="sm" style={{ height: 34, pointerEvents: "none" }}>
                  <span className="text-[#bbb]">
                    <Icon name="upload-cloud" size={30}></Icon>
                  </span>
                  <div className="text-[#263a4d]">
                    <Text size="md" inline>
                      {t("Drag and drop the file, or Browse")}
                    </Text>
                  </div>
                </Group>
                <div className="text-[#7f878f]">{t("Supports .doc, .docx, pdf formats under 5MB in size")}</div>
                <Button color="gray" className="mt-2 bg-[#F2F4F5] text-[#111]" size="sm">
                  {t("Select CV")}
                </Button>
              </div>
            </Dropzone>
            {watch("cvUrl") ? (
              <div className="mb-2 justify-center flex gap-2 items-center text-[#7f878f]">
                <File className="text-[#2C31CF]" />
                <TextLineCamp className="max-w-[200px] font-semibold text-blue-primary">
                  {watch("fileName")}
                </TextLineCamp>
                <ActionIcon variant="light" onClick={() => setValue("cvUrl", null)} color="red">
                  <Trash width={20} />
                </ActionIcon>
              </div>
            ) : null}
          </div>
        </div>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              withAsterisk
              error={errors[field.name]?.message as string}
              label={t("Introduce your self")}
              minRows={5}
              maxRows={8}
            />
          )}
        />
        <Controller
          name="agree"
          control={control}
          render={({ field }) => (
            <Checkbox
              {...field}
              checked={field.value}
              label={
                <Trans i18nKey="AGREE_PRIVACY_POLICY" t={t}>
                  I agree to
                  <Link target="_blank" href={`/terms`} className="text-[#337ab7] hover:underline">
                    Terms of Service and Privacy Policy
                  </Link>
                </Trans>
              }
              error={errors[field.name]?.message as string}
            />
          )}
        />
      </div>

      <Group position="right" mt="lg">
        <Button onClick={() => onClose()} variant="outline">
          {t("Close")}
        </Button>
        <Button loading={loading} onClick={() => handleClickSubmit()}>
          {t("RecruitmentPage.Apply")}
        </Button>
      </Group>
    </Modal>
  );
};

export default ModalApplyJob;
