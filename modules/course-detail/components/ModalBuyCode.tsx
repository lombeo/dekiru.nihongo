import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, clsx, Modal, NumberInput, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useProfileContext } from "@src/context/Can";
import { CommentContextType } from "@src/services/CommentService/types";
import { LearnService } from "@src/services/LearnService/LearnService";
import { selectProfile } from "@src/store/slices/authSlice";
import yup from "@src/validations/yupGlobal";
import { isEmpty } from "lodash";
import moment from "moment";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

interface ModalBuyCodeProps {
  courseId: number;
  handleAddToCart: (count: number, otherData?: any) => Promise<void>;
}

enum BuyVoucherTypeEnum {
  ForMe,
  Donate,
}

const ModalBuyCode = (props: ModalBuyCodeProps) => {
  const { handleAddToCart, courseId } = props;

  const { t } = useTranslation();

  const router = useRouter();
  const { asPath } = router;

  const [loading, setLoading] = useState(false);
  const urlParams = useRef(null);

  const profile = useSelector(selectProfile);

  const { authorized } = useProfileContext();

  useEffect(() => {
    if (asPath) {
      const arr = asPath.split("?");
      if (arr.length > 1) urlParams.current = arr[1];
    }
  }, [asPath]);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: {
      email: profile?.email,
      fullName: "",
      message: "",
      type: BuyVoucherTypeEnum.ForMe,
      number: 1,
      timeSend: null,
      validDateTo: moment().add(3, "months").endOf("day"),
    },
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email(t("Invalid email")).required(t("Email is required")),
        phoneNumber: (yup.string().nullable() as any).phoneNumberContact(
          t(
            "Phone number is between 4 and 15 characters including numbers, +, (). Valid phone number format: +(84)912703378 or 0912703378"
          )
        ),
        number: yup.lazy((value) =>
          value === ""
            ? yup
                .string()
                .nullable()
                .required(t("{{name}} must not be blank", { name: t("Amount") }))
            : yup
                .number()
                .nullable()
                .required(t("{{name}} must not be blank", { name: t("Amount") }))
                .min(1, t("Value min is 1"))
                .max(10000, t("The value needs to be less than or equal to {{count}}", { count: 10000 }))
        ),
        fullName: yup
          .string()
          .nullable()
          .max(
            50,
            t("Please enter no more than {{count}} characters.", {
              count: 50,
            })
          )
          .test("fullNameCheck", t("{{name}} must not be blank", { name: t("Recipient's name") }), (value, schema) =>
            schema.parent.type === BuyVoucherTypeEnum.Donate ? !isEmpty(value?.trim()) : true
          ),
        timeSend: yup
          .date()
          .nullable()
          .test("timeSendCheck1", t("Time send must be a value that is more than current time"), (value, schema) =>
            value && schema.parent.type === BuyVoucherTypeEnum.Donate ? moment().isBefore(value) : true
          ),
        validDateTo: yup
          .date()
          .nullable()
          .required(t("{{name}} must not be blank", { name: t("Expired time") }))
          .test(
            "validDateToCheck1",
            t("Expired time must be a value that is more than current time"),
            (value, schema) => (value ? moment().isBefore(value) : true)
          ),
        message: yup
          .string()
          .nullable()
          .max(
            256,
            t("Please enter no more than {{count}} characters.", {
              count: 256,
            })
          )
          .test("messageCheck", t("BUY_CODE_VALID_MESSAGE"), (value, schema) =>
            schema.parent.type === BuyVoucherTypeEnum.Donate ? !isEmpty(value?.trim()) : true
          ),
      })
    ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = methodForm;

  const handleClickSubmit = () => {
    handleSubmit(async (data) => {
      setLoading(true);
      const res = await LearnService.courseBuyVoucher({
        ...data,
        courseId: courseId,
        fullName: data.type === BuyVoucherTypeEnum.Donate ? data.fullName : "",
        message: data.type === BuyVoucherTypeEnum.Donate ? data.message : "",
        timeSend: data.type === BuyVoucherTypeEnum.Donate ? data.timeSend : new Date(),
      });
      setLoading(false);
      const orderId = res?.data?.data?.orderId;
      if (orderId) {
        let query = `orderId=${orderId}&contextType=${CommentContextType.Course}`;
        if (urlParams.current) query += `&${urlParams.current}`;
        router.push(`/payment/orders/checkout?${query}`);
      } else if (res?.data?.message) {
        Notify.error(t(res?.data?.message));
      }
    })();
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <Controller
          name="number"
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              hideControls
              label={t("Amount")}
              placeholder={t("Enter amount")}
              autoComplete="off"
              withAsterisk
              size="md"
              classNames={{ label: "text-sm" }}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              error={errors[field.name]?.message as string}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              classNames={{ label: "text-sm" }}
              label={watch("type") === 0 ? t("Email") : t("Recipient's email")}
              placeholder={watch("type") === 0 ? t("Enter email to receive code") : t("maianh@gmail.com")}
              autoComplete="off"
              withAsterisk
              size="md"
              error={errors[field.name]?.message as string}
            />
          )}
        />
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              placeholder={t("Type phone number")}
              classNames={{ label: "text-sm" }}
              label={t("Phone number")}
              autoComplete="off"
              size="md"
              error={errors[field.name]?.message as string}
            />
          )}
        />
      </div>
      <div
        className={clsx("grid items-center gap-4 mt-6", {
          "lg:grid-cols-2": authorized,
        })}
      >
        {authorized && (
          <Button
            onClick={() => {
              handleSubmit(async (data) => {
                await handleAddToCart(watch("number"), {
                  email: data.email,
                  phoneNumber: data.phoneNumber,
                  validDateTo: data.validDateTo,
                });
              })();
            }}
            loading={loading}
            className="text-base"
            size="lg"
            radius="md"
            color="dark"
          >
            {t("Add to cart")}
          </Button>
        )}
        <Button onClick={handleClickSubmit} loading={loading} className="text-base" size="lg" radius="md">
          {t("Payment")}
        </Button>
      </div>
    </>
  );
};

export default ModalBuyCode;
