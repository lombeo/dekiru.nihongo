import yup from "./yupGlobal";

export const SQLActivitySchema = yup.object({
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
      input: (yup.string() as any).trim().required("This field is required").nullable(),
      output: (yup.string() as any).trim().required("This field is required"),
      executeLimitTime: yup
        .number()
        .typeError("Please enter an valid number")
        .min(0.1, "The time limit must not be less than 0.1 seconds")
        .max(600, "The time limit must not be more than 600 seconds"),
    })
  ),

  listInputs: (yup.array() as any).of(
    yup.object().shape({
      inputContent: (yup.string() as any).trim().required("This field is required").nullable(),
    })
  ),

  programingLanguages: (yup.array() as any).test(
    "required",
    "Language support is required",
    (value: any) => Array.isArray(value) && value.length > 0
  ),

  duration: (yup.string() as any).required("The duration cannot be blank"),
  // .inRangeNumber(0, 600, "Min value is 0, max is 600"),

  level: (yup.string() as any).required("The level cannot be blank"),

  extenalCompilerURL: (yup.string() as any).trim().validUrl("Please enter correct url"),
});
