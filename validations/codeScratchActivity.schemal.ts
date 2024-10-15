import { processBreakSpaceComment } from "@src/helpers/fuction-base.helpers";
import { isEmpty } from "lodash";
import yup from "./yupGlobal";

export const CodeScratchActivitySchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("The title cannot be blank and cannot exceed 512 characters")
    .min(3, "Title must be more than 3 characters")
    .max(512, "The title cannot be blank and cannot exceed 512 characters"),

  point: yup.number().typeError("Please input a valid number").min(0, "Point must be greater than or equal to 0"),

  limitNumberSubmission: yup
    .number()
    .typeError("Please input a valid number")
    .min(0, "Limit number of submissions must be greater than or equal to 0"),

  description: yup
    .string()
    .test("emptyDesc", "The description can not be left blank", (value) => !isEmpty(processBreakSpaceComment(value))),

  duration: (yup.string() as any).required("The duration cannot be blank"),
  // .rangeNumber(0, 600, "Min value is 0, max is 600"),

  level: (yup.string() as any).required("The level cannot be blank"),

  listTestCase: (yup.array() as any).of(
    yup.object().shape({
      executeLimitTime: yup
        .number()
        .typeError("Please enter an valid number")
        .min(0.1, "The time limit must not be less than 0.1 seconds")
        .max(600, "The time limit must not be more than 600 seconds"),
    })
  ),
});
