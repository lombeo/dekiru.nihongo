import {
  DatePickerInput as DatePickerMantine,
  MonthPickerInput as MonthPickerMantine,
  YearPickerInput as YearPickerMantine,
  DatePickerInputProps,
  MonthPickerInputProps,
  YearPickerInputProps,
} from "@mantine/dates";
import React from "react";
import { Calendar } from "tabler-icons-react";

type DatePickerTypes = { levelType: string } & DatePickerInputProps & MonthPickerInputProps & YearPickerInputProps;

function DatePickerFlex(props: DatePickerTypes) {
  switch (props.levelType) {
    case "1":
      return <DatePickerMantine {...props} clearable={true} icon={<Calendar size={16} />} />;
    case "3":
      return <YearPickerMantine {...props} clearable={true} icon={<Calendar size={16} />} />;
      default:
      return <MonthPickerMantine {...props} clearable={true} icon={<Calendar size={16} />} />;
      
  }
}

export default DatePickerFlex;
