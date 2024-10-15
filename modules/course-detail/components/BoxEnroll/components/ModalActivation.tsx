import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Modal, Select, Textarea, TextInput } from "@mantine/core";
import { Notify } from "@src/components/cms";
import { useProfileContext } from "@src/context/Can";
import { validateUsername } from "@src/helpers/fuction-base.helpers";
import { LearnCourseService } from "@src/services";
import { CommentContextType } from "@src/services/CommentService/types";
import { PaymentService } from "@src/services/PaymentService";
import { setOpenModalChangeUsername } from "@src/store/slices/applicationSlice";
import yup from "@src/validations/yupGlobal";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

interface ModalActivationProps {
  onClose: () => void;
  onSuccess: () => void;
  data: any;
}

const ModalActivation = (props: ModalActivationProps) => {
  const { data, onSuccess, onClose } = props;

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { profile } = useProfileContext();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        code: yup
          .string()
          .nullable()
          .test(
            "code1",
            t("{{name}} must not be blank", {
              name: t("Voucher"),
            }),
            (value, schema) => (schema.parent.type === "2" ? true : !_.isEmpty(value?.trim()))
          ),
        description: yup
          .string()
          .nullable()
          .test(
            "description1",
            t("{{name}} must not be blank", {
              name: t("Content"),
            }),
            (value, schema) => (schema.parent.type === "1" ? true : !_.isEmpty(value?.trim()))
          ),
        // phoneNumber: yup.string().when("type", {
        //   is: "2",
        //   then: yup
        //     .string()
        //     .required(t("{{name}} must not be blank", { name: t("Phone number") }))
        //     .trim(t("{{name}} must not be blank", { name: t("Phone number") }))
        //     .matches(/(^[0-9\-\+]{1})+([0-9]{9,12})$/g, t("You must enter a valid phone number.")),
        //   otherwise: yup.string().notRequired(),
        // }),
      })
    ),
    defaultValues: {
      code: "",
      description: "",
      // phoneNumber: "",
      type: "1",
      contextId: data?.id,
      contextType: CommentContextType.Course,
    },
  });

  const handleApplyVoucher = async (data: any) => {
    setLoading(true);
    const res = await PaymentService.applyVoucher({
      orderId: 0,
      contextType: data.contextType,
      contextId: data.contextId,
      code: data.code.trim(),
    });
    setLoading(false);
    if (res?.data?.message) {
      Notify.error(t(res.data.message));
    } else if (res?.data?.success) {
      Notify.success(t("Enroll this course successfully!"));
      onSuccess();
    }
  };

  const handleRequestLearn = async (data: any) => {
    if (profile && profile.userName && validateUsername(profile.userName)) {
      dispatch(setOpenModalChangeUsername(true));
      return;
    }
    setLoading(true);
    const res = await LearnCourseService.enrollCourse({
      courseId: data.contextId,
      description: data.description,
      // phoneNumber: data.phoneNumber,
      isRequestEnroll: true,
    });
    setLoading(false);
    if (res?.data?.message) {
      Notify.error(t(res.data.message));
    } else if (res?.data?.success) {
      Notify.success(t("Request submitted successfully!"));
      onSuccess();
    }
  };

  return (
    <Modal
      opened
      size="843px"
      onClose={onClose}
      classNames={{
        content:
          "relative overflow-hidden text-white h-[606px] rounded-xl bg-cover bg-[#4261F0] bg-[url('/images/courses/bg-activation.png')]",
        header: "h-0 p-0",
        close: "absolute right-4 top-4 text-white z-10 hover:bg-transparent",
      }}
    >
      <div
        style={{
          textShadow:
            "2px 0 #073b87, -2px 0 #073b87, 0 2px #073b87, 0 -2px #073b87, 1px 1px #073b87, -1px -1px #073b87, 1px -1px #073b87, -1px 1px #073b87",
        }}
        className="md:block hidden uppercase text-[#F7E834] font-cherish text-[40px] absolute top-[40px] md:left-[50px]"
      >
        {t("Course")}
      </div>
      <div className="uppercase font-[800] absolute top-[220px] left-[124px]">{t("Knowledge is power")}</div>
      <div className="md:w-[376px] w-[320px] absolute top-[102px] md:right-[35px] right-1/2 md:translate-x-0 translate-x-1/2 flex flex-col gap-8">
        <div className="bg-white text-ink-primary rounded-[12px] p-8 flex flex-col gap-8">
          <div className="text-center font-semibold text-[24px]">{t("Activation form")}</div>
          <div className="flex flex-col gap-4">
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  data={[
                    {
                      label: t("Activation code"),
                      value: "1",
                    },
                    {
                      label: t("Request free access"),
                      value: "2",
                    },
                  ]}
                  size="md"
                />
              )}
            />
            {watch("type") === "1" && (
              <>
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <TextInput {...field} size="md" placeholder={t("Enter code")} error={errors[field.name]?.message} />
                  )}
                />
              </>
            )}
            {watch("type") === "2" && (
              <>
                {/* <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      withAsterisk
                      autoComplete="off"
                      error={errors[field.name]?.message}
                      placeholder={t("Phone number")}
                    />
                  )}
                /> */}
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      minRows={3}
                      size="md"
                      placeholder={t("Content")}
                      error={errors[field.name]?.message}
                    />
                  )}
                />
              </>
            )}
          </div>
          <Button
            loading={loading}
            onClick={() => {
              if (watch("type") === "1") {
                handleSubmit(handleApplyVoucher)();
              } else {
                handleSubmit(handleRequestLearn)();
              }
            }}
            className="max-w-[276px] w-full mx-auto"
            radius="md"
            size="lg"
          >
            {t("Active")}
          </Button>
        </div>
        <div className="text-center text-sm md:block hidden">
          {t(
            "Learning programming helps students develop logical thinking, creativity, problem solving and mastery of the future."
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ModalActivation;
