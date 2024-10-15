import { Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useTranslation } from "next-i18next";
import React from "react";

interface VoucherFilterProps {
  value: any;
  onChange: (value: any) => void;
}

const VoucherFilter = (props: VoucherFilterProps) => {
  const { value, onChange } = props;
  const { t } = useTranslation();

  const onChangeDatePicker = (e) => {
    onChange({ ...value, startDate: e, pageIndex: 1 });
  };

  return (
    <div className="grid lg:grid-cols-2 items-end gap-3">
      {/* <VoucherSearchCourse handelChangeSearchParent={handelSearchCourses} form={form} className="w-1/3" /> */}
      {/* <TextInput
                label={t("Course name")}
                placeholder={t("Course name")}
                defaultValue={name}
                onChange={e => changeModel('name', e.target.value)}
            /> */}
      <Select
        label={t("Status")}
        data={[
          { value: "0", label: t("All") },
          { value: "1", label: t("Unused") },
          { value: "2", label: t("Used") },
          { value: "3", label: t("Expired") },
        ]}
        value={value.status}
        onChange={(status) => onChange({ ...value, status: status, pageIndex: 1 })}
      />
      <DatePickerInput
        valueFormat="DD/MM/YYYY"
        decadeLabelFormat="DD/MM/YYYY"
        label={`${t("Active date")} (>=)`}
        placeholder={t("DD/MM/YYYY")}
        clearable
        classNames={{ label: "whitespace-pre" }}
        value={value.startDate}
        onChange={(date) => {
          onChangeDatePicker(date);
        }}
      />
    </div>
  );
};

export default VoucherFilter;
