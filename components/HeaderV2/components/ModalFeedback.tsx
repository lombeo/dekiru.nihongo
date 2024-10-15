import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, clsx, FileInput, Image, Modal, Text, Textarea, TextInput } from "@mantine/core";
import { getAccessToken } from "@src/api/axiosInstance";
import { ThankContactUs } from "@src/components/Svgr/components";
import { fileType } from "@src/config";
import { EMAIL_SUPPORT, HOTLINE } from "@src/constants/contact.constant";
import recaptcha from "@src/helpers/recaptcha.helper";
import { FeedbackService } from "@src/services/FeedbackService";
import { UploadService } from "@src/services/UploadService/UploadService";
import { selectProfile } from "@src/store/slices/authSlice";
import yup from "@src/validations/yupGlobal";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Mail, Phone } from "tabler-icons-react";

const ModalFeedback = (props: any) => {
  const { onClose } = props;
  const { t } = useTranslation();
  const profile = useSelector(selectProfile);
  const token = getAccessToken();

  const initialValues = {
    contactEmail: profile?.email,
    content: "",
    phoneNumber: "",
    listUrlAttachment: "",
    priority: "Medium",
  };
  const [isSuccess, setIsSuccess] = useState(false);

  const schema = yup.object().shape({
    phoneNumber: (yup.string().required(t("Phone is required")) as any).phoneNumberContact(
      t(
        "Phone number is between 4 and 15 characters including numbers, +, (). Valid phone number format: +(84)912703378 or 0912703378"
      )
    ),
    contactEmail: yup.string().email(t("Invalid email")).required(t("Email is required")),
    content: yup.string().required(t("Message is required")),
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

  const handleUpload = async (file: any) => {
    const isValid = validation(file);
    if (!isValid) {
      return null;
    }
    if (!executeRecaptcha) {
      console.log(t("Execute recaptcha not yet available"));
      return;
    }
    recaptcha.show();
    executeRecaptcha("enquiryFormSubmit")
      .then(async (gReCaptchaToken) => {
        recaptcha.hidden();
        const res = await UploadService.upload(file, fileType.assignmentAttach, gReCaptchaToken);
        if (res?.data?.success && res?.data?.data?.url) {
          setValue("listUrlAttachment", res.data.data.url, {
            shouldValidate: true,
          });
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
      })
      .catch(() => {
        recaptcha.hidden();
      });
  };

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = methodForm;

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleClickSubmit = (event: any) => {
    event.preventDefault();
    handleSubmit(async (data: any) => {
      if (!executeRecaptcha) {
        console.log(t("Execute recaptcha not yet available"));
        return;
      }
      executeRecaptcha("enquiryFormSubmit").then((gReCaptchaToken) => {
        submitEnquiryForm(data, gReCaptchaToken);
      });
    })();
  };

  const submitEnquiryForm = async (data, gReCaptchaToken) => {
    const res = await FeedbackService.saveFeedback(data, gReCaptchaToken);
    if (res?.data?.Success) {
      setTimeout(() => {
        PubSub.publish("REFETCH_FEEDBACK");
      }, 1000);
      setIsSuccess(true);
    } else Notify.error(t(res?.data?.Message));
  };

  return (
    <>
      <Modal
        title={t("Contact Us")}
        classNames={{ title: "font-semibold text-lg", body: "p-0" }}
        opened
        size="lg"
        onClose={onClose}
        withCloseButton={false}
      >
        {!isSuccess && (
          <form onSubmit={handleClickSubmit} noValidate>
            <div className="flex flex-col gap-2 pb-4 px-4">
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label={<Text className="font-semibold inline-block">{t("Phone number")}:</Text>}
                    autoComplete="off"
                    withAsterisk
                    error={errors[field.name]?.message as string}
                  />
                )}
              />
              {!token && (
                <Controller
                  name="contactEmail"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label={<Text className="font-semibold inline-block">{t("ContactUsPage.ContactEmail")}:</Text>}
                      autoComplete="off"
                      withAsterisk
                      error={errors[field.name]?.message as string}
                    />
                  )}
                />
              )}
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label={<Text className="font-semibold inline-block">{t("Your comment")}:</Text>}
                    autoComplete="off"
                    withAsterisk
                    error={errors[field.name]?.message as string}
                  />
                )}
              />
              <Controller
                name="file"
                control={control}
                render={({ field }) => (
                  <FileInput
                    {...field}
                    error={errors.logo?.message as string}
                    onChange={(file) => {
                      field.onChange(file);
                      if (file) {
                        handleUpload(file);
                      } else {
                        setValue("listUrlAttachment", null, {
                          shouldValidate: true,
                        });
                      }
                    }}
                    clearable
                    accept="file"
                    label={<Text className="font-semibold inline-block">{t("Add attachment")}:</Text>}
                  />
                )}
              />
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-3 gap-4 mt-4 items-center">
                    {[
                      {
                        label: t("High"),
                        value: "High",
                        image: "/images/feedback/sad.png",
                      },
                      {
                        label: t("Medium"),
                        value: "Medium",
                        image: "/images/feedback/normal.png",
                      },
                      {
                        label: t("Low"),
                        value: "Low",
                        image: "/images/feedback/smile.png",
                      },
                    ].map((data) => (
                      <div
                        className={clsx("flex items-center transition-all cursor-pointer justify-center", {
                          "": data.value === field.value,
                          "opacity-70 grayscale": data.value !== field.value,
                        })}
                        key={data.value}
                        onClick={() => field.onChange(data.value)}
                      >
                        <Image src={data.image} height={60} width={60} alt="" />
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>

            <div className="flex justify-end gap-4 px-6 py-4">
              <Button variant="subtle" className="w-[90px] uppercase" onClick={onClose}>
                {t("Close")}
              </Button>
              <Button type="submit" className="w-[90px] uppercase">
                {t("Save")}
              </Button>
            </div>
          </form>
        )}

        {isSuccess && (
          <>
            <div className="flex flex-col items-center">
              <ThankContactUs width={100} height={100} />
              <Text>{t("Thanks for reaching out.")}</Text>
              <Text>{t("We'll get back to you within 24 hours.")}</Text>
            </div>
            <div className="flex justify-end py-6 px-6">
              <Button variant="subtle" className="w-[90px] uppercase" onClick={onClose}>
                {t("Close")}
              </Button>
            </div>
          </>
        )}

        <div className="flex flex-col items-center py-4 gap-y-2 bg-[#f8f9fa] px-4 text-center">
          <div>{t("In case of urgent support, please contact us via")}: </div>
          <div className="grid grid-cols-2 gap-6 items-center">
            <div className="flex items-center gap-1">
              <Mail width={24} color="#555" />
              <a className="text-blue-primary" href={`mailto:${EMAIL_SUPPORT}`}>
                {EMAIL_SUPPORT}
              </a>
            </div>
            <div className="flex items-center gap-1">
              <Phone width={24} color="#555" />
              {HOTLINE}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalFeedback;
