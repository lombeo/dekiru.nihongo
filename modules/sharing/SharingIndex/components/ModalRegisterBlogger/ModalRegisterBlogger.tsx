import { Button, Group } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionIcon, Checkbox, Modal, TextInput, Textarea } from "@mantine/core";
import Link from "@src/components/Link";
import { fileType } from "@src/config";
import { formatDateGMT, processBreakSpaceComment } from "@src/helpers/fuction-base.helpers";
import SharingService from "@src/services/Sharing/SharingService";
import { UploadService } from "@src/services/UploadService/UploadService";
import { selectProfile } from "@src/store/slices/authSlice";
import { Editor } from "@tinymce/tinymce-react";
import DOMPurify from "isomorphic-dompurify";
import { isEmpty, isNil } from "lodash";
import { Trans, useTranslation } from "next-i18next";
import { useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Plus, Trash, Upload } from "tabler-icons-react";
import * as yup from "yup";
import styles from "./ModalRegisterBlogger.module.scss";

interface ModalRegisterBloggerProps {
  onClose: () => void;
  onSuccess: () => void;
  data: any;
}

const ModalRegisterBlogger = (props: ModalRegisterBloggerProps) => {
  const { data, onClose, onSuccess } = props;
  const { t } = useTranslation();
  const profile = useSelector(selectProfile);

  const initialValues: any = {
    description: "",
    contactInfo: `UserName: ${data?.userName || ""}\nPhoneNumber: ${data?.phoneNumber || ""}\nEmail: ${
      profile?.email || ""
    }\nAddress: ${data?.cityName || ""}\nJoinedDate: ${formatDateGMT(data?.createdUtc, "YYYY-MM-DD")}`,
    workExperience: "",
    schools: [{ value: "" }],
    certificates: [
      {
        uri: "",
        name: "",
      },
    ],
  };

  const refIndexCertificate = useRef(0);
  const [loading, setLoading] = useState(false);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        contactInfo: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Contact") }))
          .trim(t("{{name}} must not be blank", { name: t("Contact") }))
          .max(
            256,
            t("{{name}} must be less than {{count}} characters", {
              count: 256,
              name: t("Contact"),
            })
          ),
        workExperience: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Work experience") }))
          .trim(t("{{name}} must not be blank", { name: t("Work experience") }))
          .max(
            256,
            t("{{name}} must be less than {{count}} characters", {
              count: 256,
              name: t("Work experience"),
            })
          ),
        schools: yup
          .array()
          .nullable()
          .of(
            yup.object().shape({
              value: yup
                .string()
                .nullable()
                .max(
                  256,
                  t("{{name}} must be less than {{count}} characters", {
                    count: 256,
                    name: t("School"),
                  })
                ),
            })
          ),
        certificates: yup
          .array()
          .nullable()
          .of(
            yup.object().shape({
              name: yup
                .string()
                .nullable()
                .max(
                  256,
                  t("{{name}} must be less than {{count}} characters", {
                    count: 256,
                    name: t("Certificate name"),
                  })
                )
                .test(
                  "emptyCerName",
                  t("{{name}} must not be blank", { name: t("Certificate name") }),
                  (value, context) => {
                    return !((isNil(value) || value.trim() === "") && !isEmpty(context.parent.uri));
                  }
                ),
              uri: yup
                .string()
                .nullable()
                .max(
                  256,
                  t("{{name}} must be less than {{count}} characters", {
                    count: 256,
                    name: t("Certificate url"),
                  })
                )
                .test(
                  "emptyCerUrl",
                  t("{{name}} must not be blank", { name: t("Certificate url") }),
                  (value, context) => {
                    return !((isNil(value) || value.trim() === "") && !isEmpty(context.parent.name));
                  }
                ),
            })
          ),
        agree: yup
          .boolean()
          .nullable()
          .required(t("You have not agreed to our Terms of Service and Privacy Policy"))
          .isTrue(t("You have not agreed to our Terms of Service and Privacy Policy")),
      })
    ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    trigger,
  } = methodForm;

  const handleClickSubmit = () => {
    handleSubmit(async (data) => {
      let description = processBreakSpaceComment(data.description);
      description = DOMPurify.sanitize(description, {
        ALLOWED_TAGS: ["p", "strong", "b", "em", "span", "div", "img", "a"],
        ALLOWED_ATTR: ["style"],
      });
      if (isNil(description) || description == "") {
        Notify.error(t("{{name}} must not be blank", { name: t("Description") }));
        return;
      }
      if (description.length > 10000) {
        Notify.error(t(`Description exceeds allowed length` + `: ${description.length}/10000`));
        return;
      }

      const schools = data.schools?.flatMap((e) => (isEmpty(e.value) || e.value.trim() === "" ? [] : e.value));
      if (!schools || schools.length <= 0) {
        Notify.error(t("{{name}} must not be blank", { name: t("School") }));
        return;
      }

      const certificates = data?.certificates?.flatMap((e) =>
        (isEmpty(e.uri) || e.uri.trim() === "") && (isEmpty(e.name) || e.name.trim() === "") ? [] : e
      );
      if (!certificates || certificates.length <= 0) {
        Notify.error(t("{{name}} must not be blank", { name: t("Certificate") }));
        return;
      }

      setLoading(true);
      const res = await SharingService.blogRegisterBlogger({
        description,
        registerInfo: {
          schools,
          certificates,
          workExperience: data.workExperience,
          contactInfo: data.contactInfo,
        },
      });
      setLoading(false);
      if (res?.data?.success) {
        Notify.success(t("Blogger registration request sent successfully!"));
        onClose();
        reset(initialValues);
        onSuccess?.();
      } else if (res?.data?.message) {
        Notify.error(t(res?.data?.message));
      }
    })();
  };

  const schoolsField = useFieldArray({
    control,
    name: "schools",
  });

  const certificatesField = useFieldArray({
    control,
    name: "certificates",
  });

  const validation = (file: any) => {
    let isValid = true;
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

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    const isValid = validation(file);
    if (!isValid) {
      return;
    }
    const res = await UploadService.upload(file, fileType.assignmentAttach);
    if (res.data?.success && res.data.data) {
      const url = res.data.data.url;
      setValue(`certificates.[${refIndexCertificate.current}]`, {
        uri: url,
        name: file.name,
      });
    }
  };

  return (
    <Modal
      classNames={{ title: "font-semibold text-lg uppercase" }}
      title={t("Register as Sharer")}
      size="1000px"
      centered
      onClose={onClose}
      opened
    >
      <input
        accept="image/png, image/gif, image/jpeg"
        type="file"
        id="fileInput"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="flex gap-4 flex-col">
        <div>
          <div>
            {t("You do not have permission to create posts if you want to post them today. Please register here.")}
          </div>
          <div className="text-[red]">
            {t(
              "Note: The information you provide will be kept confidential and will only be used for verification purposes."
            )}
          </div>
        </div>
        <Controller
          name="contactInfo"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder={t("Name, date of birth, phone number, email, foreign languages")}
              error={errors[field.name]?.message as string}
              minRows={3}
              maxRows={3}
              withAsterisk
              classNames={{ label: "font-semibold" }}
              label={t("Contact")}
            />
          )}
        />
        <Controller
          name="workExperience"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              minRows={3}
              maxRows={5}
              error={errors[field.name]?.message as string}
              withAsterisk
              classNames={{ label: "font-semibold" }}
              label={t("Work experience")}
            />
          )}
        />
        <div className="flex flex-col">
          <div className="text-sm mb-[2px] flex gap-2">
            <div className="font-semibold">
              {t("School")}&nbsp;<span className="text-[#fa5252]">*</span>
            </div>
            <ActionIcon
              variant="filled"
              size="sm"
              className="bg-[#EFEFEF]"
              color="gray"
              onClick={() => {
                trigger("schools");
                schoolsField.append({
                  value: "",
                });
              }}
            >
              <Plus color="#333" width={16} />
            </ActionIcon>
          </div>
          <div className="mt-2 flex gap-2 flex-col">
            {schoolsField.fields.map((field, index) => (
              <div key={field.id} className="grid items-start grid-cols-[20px_1fr_auto] gap-4">
                <div className="flex h-[36px] items-center justify-center">{index + 1}</div>
                <Controller
                  name={`schools.[${index}].value`}
                  control={control}
                  render={({ field }) => (
                    <TextInput {...field} error={errors.schools?.[index]?.value?.message as string} />
                  )}
                />
                <ActionIcon
                  variant="outline"
                  className="h-[36px] w-[36px] border-[#ced4da]"
                  size="lg"
                  onClick={() => schoolsField.remove(index)}
                >
                  <Trash width={20} />
                </ActionIcon>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="text-sm mb-[2px] flex gap-2 items-center">
            <div className="font-semibold">
              {t("Certificate")}&nbsp;<span className="text-[#fa5252]">*</span>
            </div>
            <ActionIcon
              size="sm"
              className="bg-[#EFEFEF]"
              onClick={() => {
                trigger("certificates");
                certificatesField.append({
                  uri: "",
                  name: "",
                });
              }}
            >
              <Plus color="#333" width={16} />
            </ActionIcon>
          </div>

          <div className="mt-2 flex flex-col gap-4">
            {certificatesField.fields.map((field, index) => (
              <div className="grid gap-5 grid-cols-[20px_auto]" key={field.id}>
                <div className="flex h-[36px] items-center justify-center">{index + 1}</div>
                <div className="w-full flex flex-col gap-2">
                  <div className="grid gap-4 grid-cols-[1fr_auto]">
                    <Controller
                      name={`certificates.[${index}].name`}
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          placeholder={t("Certificate name")}
                          error={errors.certificates?.[index]?.name?.message as string}
                        />
                      )}
                    />
                    <ActionIcon
                      variant="outline"
                      className="h-[36px] w-[36px] border-[#ced4da]"
                      size="lg"
                      onClick={() => certificatesField.remove(index)}
                    >
                      <Trash width={20} />
                    </ActionIcon>
                  </div>
                  <div className="grid gap-4 grid-cols-[1fr_auto]">
                    <Controller
                      name={`certificates.[${index}].uri`}
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          placeholder={t("Certificate url")}
                          error={errors.certificates?.[index]?.uri?.message as string}
                        />
                      )}
                    />
                    <ActionIcon
                      variant="outline"
                      className="h-[36px] w-[36px] border-[#ced4da]"
                      size="lg"
                      onClick={() => {
                        refIndexCertificate.current = index;
                        document.getElementById("fileInput").click();
                      }}
                    >
                      <Upload width={20} />
                    </ActionIcon>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold">
            {t("Further description")}&nbsp;<span className="text-[#fa5252]">*</span>
          </div>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div className={styles["editor"]}>
                <Editor
                  value={field.value}
                  onEditorChange={(e) => {
                    field.onChange(e);
                  }}
                  init={{
                    indent: false,
                    branding: false,
                    menubar: false,
                    // toolbar: false,
                    file_browser_callback: false,
                    quickbars_selection_toolbar: false,
                    quickbars_insert_toolbar: false,
                    statusbar: false,
                    convert_urls: false,
                    placeholder: "",
                    content_css: "/editor.css",
                  }}
                  tinymceScriptSrc={"https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.7.0/tinymce.min.js"}
                />
              </div>
            )}
          />
        </div>

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
          {t("Register")}
        </Button>
      </Group>
    </Modal>
  );
};

export default ModalRegisterBlogger;
