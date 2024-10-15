import yup from "./yupGlobal";

export const RoleSchema = yup.object({
  name: yup.string().trim().required("This field is required")
});
