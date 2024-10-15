import yup from "./yupGlobal";

//Question validation
export const UpdateProfileSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required("Full name is required")
    .max(255, "Full name must no exceed 255 characters"),
  phoneNumber: (yup.string() as any).phoneNumber(
    "Phone number is between 4 and 16 characters including numbers, +, () .Valid phone number format: +(84)912703378 or 0912703378"
  ),
  website: (yup.string() as any).trim().validUrl("Please enter correct url"),
});

//Question single choice
export const ResetPassSchema = yup.object({
  currentPass: yup.string().trim().required("Current password is required"),
  newPass: (yup.string() as any)
    .trim()
    .required("New password is required")
    .inRangeString(
      true,
      6,
      100,
      "Password must be between 6 and 100 characters, including text, number, and special characters !@#$%^&*()"
    )
    .password(
      "Password must be between 6 and 100 characters, including text, number, and special characters !@#$%^&*()"
    ),
  newPassRetype: (yup.string() as any)
    .trim()
    .required("Confirm password is required")
    .inRangeString(
      true,
      6,
      100,
      "Password must be between 6 and 100 characters, including text, number, and special characters !@#$%^&*()"
    )
    .password(
      "Password must be between 6 and 100 characters, including text, number, and special characters !@#$%^&*()"
    )
    .oneOf(
      [yup.ref("newPass"), null],
      "Password does not match. Please try again"
    ),
});
