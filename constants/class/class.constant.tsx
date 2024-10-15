export const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const weekDaysVn = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const monthsVn = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

export enum ClassRoleEnum {
  None = 0,
  ClassMember = 1,
  ClassManager = 2,
  AssignedClassManager = 3,
  AssignedClassMonitor = 4,
  StudentManager = 5,
  ViewReport = 6,
  EditContent = 7,
}

export enum ClassDurationStatusEnum
{
    None = 0,
    NOT_STARTED = 1,
    INPROGRESS = 2,
    ENDED = 3
}