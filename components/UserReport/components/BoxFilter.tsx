import { NumberInput, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { Dispatch } from "react";
import { UserReportType } from "../UserReport";

interface BoxValueProps {
  value: any;
  onChange: Dispatch<any>;
}

const BoxValue = (props: BoxValueProps) => {
  const { value, onChange } = props;

  const { t } = useTranslation();

  return (
    <div className="grid lg:grid-cols-3 lg:w-fit gap-4">
      <Select
        data={[
          {
            label: t("Week"),
            value: UserReportType.Week,
          },
          {
            label: t("Day"),
            value: UserReportType.Day,
          },
        ]}
        value={value.type}
        onChange={(value) => {
          onChange((prev) => ({
            ...prev,
            type: value,
          }));
        }}
        // label={t("Value by")}
      />
      {value.type === UserReportType.Day && (
        <>
          <DatePickerInput
            placeholder={t("From date")}
            valueFormat="DD/MM/YYYY HH:mm"
            value={value.from}
            onChange={(value) => onChange((prev) => ({ ...prev, from: moment(value).startOf("day").toDate() }))}
          />
          <DatePickerInput
            placeholder={t("To date")}
            valueFormat="DD/MM/YYYY HH:mm"
            value={value.to}
            onChange={(value) => onChange((prev) => ({ ...prev, to: moment(value).startOf("day").toDate() }))}
          />
        </>
      )}
      {value.type === UserReportType.Week && (
        <>
          <NumberInput
            hideControls
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            // label={t("Week")}
            defaultValue={5}
            onBlur={(event) => {
              onChange((prev) => ({
                ...prev,
                week: event.target.value,
              }));
            }}
            max={52}
          />
        </>
      )}
    </div>
  );
};

export default BoxValue;
