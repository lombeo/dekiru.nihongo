import yup from "./yupGlobal";

export const TestCaseSchema = yup.object({
  output: yup.string().trim().required("Output is required"),

  executeLimitTime: yup
    .string()
    .trim()
    .required("ExecuteLimitTime is required")
    .min(0.1, "Execute Limit Time must be greater or equal than 0.1")
    .max(600, "Execute Limit Time must be smaller or equal than 600"),

  input: (yup.array() as any).of(
    yup.object().shape({
      content: (yup.string() as any).trim().required("This field is required"),
    })
  ),
});
