import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Modal, TextInput, Textarea, Text, Table, ActionIcon, Group } from "@mantine/core";
import yup from "@src/validations/yupGlobal";
import { useTranslation } from "next-i18next";
import styles from "@src/styles/Table.module.scss";
import { Controller, useForm } from "react-hook-form";
import { Edit, Plus, Trash } from "tabler-icons-react";
import { DatePickerInput } from "@mantine/dates";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  campaignData?: any;
}

const courses = [
  { name: "Khóa số 1", webPrice: 150000, campaignPrice: 120000 },
  { name: "Khóa số 2", webPrice: 150000, campaignPrice: 120000 },
  { name: "Khóa số 3", webPrice: 150000, campaignPrice: 120000 },
  { name: "Khóa số 4", webPrice: 150000, campaignPrice: 120000 },
];

export default function ModalCreateEditCampaign(props: IProps) {
  const { isOpen, onClose, campaignData } = props;
  const { t } = useTranslation();

  const initialValues = {
    code: campaignData?.code || "",
    name: campaignData?.name || "",
    fromDate: campaignData?.fromDate || "",
    toDate: campaignData?.toDate || "",
    description: campaignData?.description || "",
  };

  const schema = yup.object().shape({
    code: yup.string().required(t("This field is required")),
    name: yup.string().required(t("This field is required")),
    fromDate: yup.date().required(t("This field is required")),
    toDate: yup.date().required(t("This field is required")),
    description: yup.string(),
  });

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = methodForm;

  const handleClose = () => {
    reset(initialValues);
    onClose();
  };

  const onSubmit = async (data: any) => {
    // Handle save logic here
    console.log(data);
    Notify.success(t("Campaign saved successfully!"));
    handleClose();
  };

  console.log(campaignData);
  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={
        <Text className="font-semibold text-[#25265e]">
          {campaignData == null ? t("Edit campaign") : t("Create Campaign")}
        </Text>
      }
      size="xl"
    >
      <form className="flex flex-col gap-4 mt-2 px-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label={<Text className="font-semibold inline">{t("Campaign code")}</Text>}
              required
              error={errors?.[field.name]?.message as any}
              {...field}
            />
          )}
        />
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label={<Text className="font-semibold inline">{t("Campaign name")}</Text>}
              required
              error={errors?.[field.name]?.message as any}
              {...field}
            />
          )}
        />
        <Controller
          name="fromDate"
          control={control}
          render={({ field }) => (
            <DatePickerInput
              label={t("From date")}
              required
              valueFormat="DD/MM/YYYY"
              decadeLabelFormat="DD/MM/YYYY"
              placeholder={t("From date")}
              clearable
            />
          )}
        />
        <Controller
          name="toDate"
          control={control}
          render={({ field }) => (
            <DatePickerInput
              label={t("To date")}
              required
              valueFormat="DD/MM/YYYY"
              decadeLabelFormat="DD/MM/YYYY"
              placeholder={t("To date")}
              clearable
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label={<Text className="font-semibold inline">{t("Description")}</Text>}
              error={errors?.[field.name]?.message as any}
              {...field}
            />
          )}
        />

        {/* Courses Table */}
        <div className="flex items-center">
          <Text className="font-semibold mt-4 flex-grow">{t("Course List")}</Text>
          <Button
            className=""
            leftIcon={<Plus />}
            // onClick={() => {
            //   setCreateEditCampaign(true);
            //   setFilter(DEFAULT_FILTER);
            // }}
          >
            {t("Add")}
          </Button>
        </div>
        <Table className={styles.table} striped withBorder>
          <thead>
            <tr>
              <th>{t("Course")}</th>
              <th>{t("Web price")}</th>
              <th>{t("Campaign price")}</th>
              <th>{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index}>
                <td>{course.name}</td>
                <td>{course.webPrice}</td>
                <td>{course.campaignPrice}</td>
                <td className="flex-grow">
                  <Group spacing="xs">
                    <ActionIcon size="sm" color="blue" onClick={() => console.log("Bấm được")}>
                      <Edit />
                    </ActionIcon>
                    <ActionIcon size="sm" color="red"  onClick={() => console.log("Bấm được")}>
                      <Trash />
                    </ActionIcon>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="flex gap-3 pt-5 justify-end">
          <Button variant="outline" onClick={handleClose}>
            {t("Close")}
          </Button>
          <Button type="submit">{t("Save")}</Button>
        </div>
      </form>
    </Modal>
  );
}
