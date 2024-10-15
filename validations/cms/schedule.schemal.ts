import yup from "./yupGlobal";
export const ScheduleSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("The title cannot be blank and cannot exceed 512 characters")
    .max(512, "The title cannot be blank and cannot exceed 512 characters"),

});
