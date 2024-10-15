import yup from "./yupGlobal";

export const BankSchema = yup.object({
  title: (yup.string() as any)
    .trim()
    .required("The title cannot be blank and cannot exceed 512 characters")
    .titleActivity("Title must contain at least one alpha character (A - Z, a - z)")
    .max(512, "The title cannot be blank and cannot exceed 512 characters"),

  tags: (yup.mixed() as any).validateTagsElementRangeLength(3, 20),
});
