import { Button, Group, Modal, NumberInput, Text, Textarea, TextInput } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { yupResolver } from "@hookform/resolvers/yup";
import { Radio } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { fileType } from "@src/config";
import { CourseType } from "@src/constants/courses/courses.constant";
import { LearnActivityService } from "@src/services/LearnActivityService";
import { UploadService } from "@src/services/UploadService/UploadService";
import clsx from "clsx";
import { isNil, toString } from "lodash";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const GradeAssignmentModal = (props: any) => {
  const { open, onClose, onSuccess, activityId, selected, data: dataAssignment } = props;
  const { t } = useTranslation();
  const [loadingForm, setLoadingForm] = useState<any>(false);
  const [file, setFile] = useState<any>(null);

  //Validate file
  const validation = (data: any) => {
    let isValid = true;
    const file = data[0];
    if (file.size == 0) {
      Notify.error(t("Import file size is too small or invalid, please check again"));
      isValid = false;
    }
    if (file.size > 1024 * 1000 * 25) {
      Notify.error(t("Attachment file size cannot exceed 25MB"));
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
      setFile({
        fileUrl: url,
        fileName: file.name,
      });
    }
  };

  const initialValues: any = {
    option: 1,
  };

  const getSchemaValidate = () => {
    return yup.object().shape({
      point: yup
        .string()
        .required(t("Point must be a valid number and can not be blank"))
        .trim(t("Point must be a valid number and can not be blank")),
      comment: yup
        .string()
        .required(t("Your comment must not be blank"))
        .trim(t("Your comment must not be blank"))
        .max(256, t("Your comment must be less than 256 characters")),
    });
  };

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(getSchemaValidate()),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = methodForm;

  const submit = () => {
    handleSubmit(async (data) => {
      // if (isNil(data.point) || data.point === "") {
      //   Notify.error(t("Point must be a valid number and can not be blank"));
      //   return;
      // }
      if (
        dataAssignment?.activityData?.metadata?.maxScore &&
        data.point > dataAssignment?.activityData?.metadata?.maxScore
      ) {
        Notify.error(t("The score cannot exceed the maximum score"));
        return;
      }
      setLoadingForm(true);
      const res = await LearnActivityService.gradeAssignment({
        activityId,
        activityTitle: dataAssignment?.title,
        sessionId: 0,
        point: toString(data.point ?? 0),
        comment: data.comment,
        url: data.option == 2 ? data?.fileUrl : file?.fileUrl,
        urlName: data.option == 2 ? "" : file?.fileName,
        courseType: CourseType.Personal,
        courseId: dataAssignment.courseId,
        studentId: selected?.userId,
      });
      setLoadingForm(false);
      if (res?.data?.success) {
        onSuccess();
        onClose();
        Notify.success(t("The point on the assignment has been changed."));
      } else if (res.data?.message) {
        Notify.error(t(res.data.message));
      }
    })();
  };

  return (
    <>
      <Modal title={t("Grade assignment")} size="xl" opened={open} zIndex={300} onClose={onClose}>
        <div>
          <Text className="text-xl mt-6 font-semibold mb-3">
            {t("Grade (Max score: {{score}})", { score: dataAssignment?.activityData?.metadata?.maxScore })}
          </Text>
          <div className="grid grid-cols-[2fr_5fr] gap-5">
            <div className="bg-[#F1F3F5] px-4 py-2 rounded-md ">
              <Controller
                name="point"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    label={t("Point")}
                    className="grow"
                    onChange={field.onChange}
                    hideControls
                    error={errors["point"]?.message as any}
                    required
                    min={0}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    value={isNil(field.value) ? "" : field.value}
                  />
                )}
              />
            </div>
            <div className="bg-[#F1F3F5] px-4 py-2 rounded-md flex flex-col justify-center w-full">
              <Controller
                name="comment"
                control={control}
                render={({ field }) => (
                  <Textarea
                    error={errors["comment"]?.message as any}
                    label={t("TEACHER_COMMENT")}
                    required
                    size="md"
                    {...field}
                    minRows={3}
                  />
                )}
              />
              <Text className="mt-4">{t("File")}</Text>
              <div className="flex gap-5 justify-between mt-4">
                <div className="mt-5">
                  <Radio value={"1"} onClick={() => setValue("option", 1)} checked={watch("option") == 1} />
                </div>
                <div
                  className={clsx(" flex-none w-[calc(100%_-_40px)]", {
                    "cursor-not-allowed opacity-40 pointer-events-none": watch("option") != 1,
                  })}
                >
                  <Dropzone
                    multiple={false}
                    onDrop={(files) => onChangeFiles(files)}
                    onReject={(files) => console.log("rejected files", files)}
                  >
                    <Group position="center" spacing="sm" style={{ height: 34, pointerEvents: "none" }}>
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
                </div>
              </div>
              {file && (
                <div className="mt-4 bg-[#F1F3F5] px-4 py-2 rounded-md min-h-[50px] flex gap-5 justify-between items-center">
                  <Text className="font-semibold">{file.fileName}</Text>
                  <div className="cursor-pointer w-6 " onClick={() => setFile(null)}>
                    <Icon name="close" className="text-[#868e96] hover:text-[#045fbb]" />
                  </div>
                </div>
              )}
              <Text className="mt-4">
                (<span className="text-red-500">*</span>) {t("File size limit:")}25MB
              </Text>
              <Text className="mt-5">{t("Link")}</Text>
              <div className="flex gap-5 items-center mt-4">
                <div>
                  <Radio value={"2"} onClick={() => setValue("option", 2)} checked={watch("option") == 2} />
                </div>
                <Controller
                  name="fileUrl"
                  control={control}
                  render={({ field }) => (
                    <TextInput disabled={watch("option") != 2} className="w-full" required size="md" {...field} />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <Group>
            <Button onClick={() => onClose()} variant="outline">
              {t("Cancel")}
            </Button>
            <Button loading={loadingForm} onClick={() => submit()}>
              {t("Save")}
            </Button>
          </Group>
        </div>
      </Modal>
    </>
  );
};

export default GradeAssignmentModal;
