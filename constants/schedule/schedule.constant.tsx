import { type } from "os";

export enum ScheduleUnitEnum {
  Week = 0,
  Day = 1,
  Hour = 2,
  Session = 3,
  Module = 4,
}

export type ScheduleUnit = {
  type: ScheduleUnitEnum;
  label?: string;
  labels?: string;
  icon?: any;
};

export const ScheduleType: Array<ScheduleUnit> = [
  {
    label: "Week",
    labels: "Weeks",
    type: ScheduleUnitEnum.Week,
  },
  {
    label: "Day",
    labels: "Days",
    type: ScheduleUnitEnum.Day,
  },
  {
    label: "Hour",
    labels: "Hours",
    type: ScheduleUnitEnum.Hour,
  },
  {
    label: "SESSION_LABEL",
    labels: "SESSIONS_LABEL",
    type: ScheduleUnitEnum.Session,
  },
  {
    label: "MODULE_LABEL",
    labels: "MODULES_LABEL",
    type: ScheduleUnitEnum.Module,
  },
];

export function getScheduleUnit(type: ScheduleUnitEnum) {
  const activityType = ScheduleType.find((x) => {
    return x.type === type;
  });
  return activityType;
}
