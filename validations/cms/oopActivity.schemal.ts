import yup from "./yupGlobal";

export const OOPActivitySchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("The title cannot be blank and cannot exceed 512 characters")
    .max(512, "The title cannot be blank and cannot exceed 512 characters"),

  point: yup.number().typeError("Please input a valid number").min(0, "Point must be greater than or equal to 0"),

  limitCodeCharacter: yup
    .number()
    .typeError("Please input a valid number")
    .min(0, "Limit coding characters must be greater than or equal to 0")
    .max(100000, "Limit coding characters must be smaller than or equal to 100000"),

  limitNumberSubmission: yup
    .number()
    .typeError("Please input a valid number")
    .min(0, "Limit number of submissions must be greater than or equal to 0"),
  listTestCase: (yup.array() as any).of(
    yup.object().shape({
      title: (yup.string() as any).trim().required("This field is required"),
      content: (yup.string() as any).trim().required("This field is required"),
      output: (yup.string() as any).trim().required("This field is required"),
    })
  ),

  duration: (yup.string() as any).required("The duration cannot be blank"),
  // .rangeNumber(0, 600, "Min value is 0, max is 600"),

  level: (yup.string() as any).required("The level cannot be blank"),

  extenalCompilerURL: (yup.string() as any).trim().validUrl("Please enter correct url"),
});
