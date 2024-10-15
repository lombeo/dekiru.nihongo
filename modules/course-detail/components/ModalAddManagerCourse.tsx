import { Button } from "@edn/components/Button";
import { Modal } from "@edn/components/Modal";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { MultiSelect, NumberInput, Select } from "@mantine/core";
import { LearnCourseService } from "@src/services";
import { FriendService } from "@src/services/FriendService/FriendService";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const ModalAddManagerCourse = ({ courseId, selected, onClose, onSuccess }: any) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [userOptions, setUserOptions] = useState<any[]>(
    selected
      ? [
          {
            label: selected.username,
            value: _.toString(selected.userId),
          },
        ]
      : []
  );

  const initialValues: any = selected
    ? {
        roles: selected.roles,
        userId: _.toString(selected.userId),
        vale: selected?.roles?.find((e) => e.role === 5)?.value || 0,
      }
    : {
        roles: [],
        userId: null,
      };

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        userId: yup.lazy((value) =>
          value === ""
            ? yup
                .string()
                .nullable()
                .required(t("{{name}} must not be blank", { name: t("User") }))
            : yup
                .number()
                .nullable()
                .required(t("{{name}} must not be blank", { name: t("User") }))
        ),
        roles: yup
          .array()
          .nullable()
          .required(t("{{name}} must not be blank", { name: t("Role") }))
          .min(1, t("{{name}} must not be blank", { name: t("Role") })),
        value: yup.lazy((value) =>
          value === ""
            ? yup.string().nullable()
            : yup
                .number()
                .nullable()
                .min(
                  0,
                  t("{{from}} must be greater than {{to}}", {
                    from: t("Over allow number"),
                    to: 0,
                  })
                )
                .max(
                  100,
                  t("{{from}} must be less than or equal to {{to}}", {
                    from: t("Over allow number"),
                    to: 100,
                  })
                )
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

  const submit = () => {
    handleSubmit(async (data) => {
      setLoading(true);
      const res = await LearnCourseService.addRemoveManager({
        courseId: courseId,
        managerId: +data.userId,
        roles: data.roles?.map((e) => ({
          role: e.role,
          value: e.role === 5 ? data.value : 0,
        })),
      });
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

  const handleSearchUsers = useCallback(
    _.debounce((query: string) => {
      if (!query || query.trim().length < 2) return;
      FriendService.searchUser({
        filter: query,
      }).then((res) => {
        let data = res?.data?.data;
        if (data) {
          data = data.map((user) => ({
            label: user.userName,
            value: _.toString(user.userId),
          }));
          setUserOptions((prev) => _.uniqBy([...prev, ...data], "value"));
        }
      });
    }, 300),
    []
  );

  return (
    <Modal
      classNames={{ title: "font-semibold text-lg" }}
      opened
      onClose={onClose}
      title={t(selected ? "Update role" : "Add user")}
      size="lg"
    >
      <div className="flex gap-4 flex-col">
        <Controller
          name="userId"
          control={control}
          render={({ field }) => (
            <Select
              nothingFound={t("No result found")}
              data={userOptions}
              readOnly={!!selected}
              clearable
              searchable
              withAsterisk
              error={errors?.[field.name]?.message as any}
              onSearchChange={handleSearchUsers}
              value={field.value}
              onChange={(value) => field.onChange(value)}
              label={t("User")}
            />
          )}
        />
        <Controller
          name="roles"
          control={control}
          render={({ field }) => (
            <MultiSelect
              {...field}
              value={field.value?.map((e: any) => _.toString(e.role))}
              onChange={(value) => {
                field.onChange(value?.map((e) => ({ role: +e, value: 0 })));
              }}
              label={t("Role")}
              withinPortal
              withAsterisk
              error={errors?.[field.name]?.message as any}
              data={[
                { label: t("Course manager"), value: "1" },
                { label: t("Student manager"), value: "2" },
                { label: t("View report"), value: "3" },
                { label: t("Grade assignment"), value: "4" },
                { label: t("Create voucher"), value: "5" },
              ]}
            />
          )}
        />
        {watch("roles")?.some((e) => e.role === 5) && (
          <Controller
            name="value"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                hideControls
                label={t("Maximum allowed number of vouchers")}
                error={errors?.[field.name]?.message as any}
              />
            )}
          />
        )}
      </div>
      <div className="flex justify-end mt-5 gap-5">
        <Button variant="outline" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button loading={loading} onClick={submit}>
          {t(selected ? "Save" : "Add")}
        </Button>
      </div>
    </Modal>
  );
};
export default ModalAddManagerCourse;
