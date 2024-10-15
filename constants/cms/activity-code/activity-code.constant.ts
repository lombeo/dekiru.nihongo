export enum ActivityCodeTypeEnum {
  Code = 0,
  OOP = 1,
  SQL = 2,
  Scratch = 3,
}

export type ActivityCodeItem = {
  type: ActivityCodeTypeEnum;
  label?: string;
  icon?: any;
  name?: string;
  hideInModal?: boolean;
};

export const activityCodeTypes: Array<ActivityCodeItem> = [
  {
    label: "Programming",
    icon: "clipboard_code",
    type: ActivityCodeTypeEnum.Code,
    name: "code",
  },
  {
    label: "OOP",
    icon: "clipboard_code",
    type: ActivityCodeTypeEnum.OOP,
    name: "oop",
  },
  {
    label: "SQL",
    icon: "clipboard_code",
    type: ActivityCodeTypeEnum.SQL,
    name: "sql",
  },
  {
    label: "Scratch",
    icon: "clipboard_code",
    type: ActivityCodeTypeEnum.Scratch,
    name: "scratch",
  },
];
