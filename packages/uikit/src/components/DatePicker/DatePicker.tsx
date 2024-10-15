import { DatePickerInput as DatePickerMantine, DatePickerInputProps } from "@mantine/dates";
import React from "react";
import { Calendar } from "tabler-icons-react";

function DatePicker(props: DatePickerInputProps) {
  return <DatePickerMantine {...props} clearable={true} icon={<Calendar size={16} />} />;
}

export default DatePicker;
