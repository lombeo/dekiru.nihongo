import yup from "./yupGlobal";

export const ImportFileAccountSchema = yup.object({
  file: (yup.mixed() as any)
    .required("File import is required")
    .fileSizeZero()
    .fileSizeMax(2)
    .fileNameMax(100),
});

export const AddAccountSchema = yup.object({
  email: (yup.string() as any)
    .trim()
    .required("Email can not be blank")
    .email("Invalid email address"),
  fullName: (yup.string() as any)
    .trim()
    .required("Full name is required")
    .max(255, "Full name must no exceed 255 characters"),
  rollNumber: (yup.string() as any)
    .trim()
    .inRangeString(
      false,
      2,
      30,
      "Roll number from 2-30 characters, including: Text: a..z, A...Z Number: 0..9"
    )
    .checkRollNumber(
      "Roll number from 2-30 characters, including: Text: a..z, A...Z Number: 0..9"
    ),
  newPassWord: (yup.string() as any)
    .trim()
    .required("Password is required")
    .inRangeString(
      true,
      6,
      100,
      "Password must be between 6 and 100 characters, including text, number, and special characters !@#$%^&*()"
    )
    .password(
      "Password must be between 6 and 100 characters, including text, number, and special characters !@#$%^&*()"
    ),
  rePassWord: (yup.string() as any)
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
      [yup.ref("newPassWord"), null],
      "Password does not match. Please try again"
    ),
});

export const UpdateUserSchema = yup.object({
  email: (yup.string() as any)
    .trim()
    .required("Email can not be blank")
    .email("Invalid email address"),
  fullName: (yup.string() as any)
    .trim()
    .required("Full name is required")
    .max(255, "Full name cannot exceed 255 characters"),
  rollNumber: (yup.string() as any)
    .trim()
    .inRangeString(
      false,
      2,
      30,
      "Roll number from 2-30 characters, including: Text: a..z, A...Z Number: 0..9"
    )
    .checkRollNumber(
      "Roll number from 2-30 characters, including: Text: a..z, A...Z Number: 0..9"
    ),
});

export const ResetPassSchema = yup.object({
  newPassWord: (yup.string() as any)
    .trim()
    .required("Password is required")
    .inRangeString(
      true,
      6,
      100,
      "Password must be between 6 and 100 characters, including text, number, and special characters !@#$%^&*()"
    )
    .password(
      "Password must be between 6 and 100 characters, including text, number, and special characters !@#$%^&*()"
    ),
  rePassWord: (yup.string() as any)
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
      [yup.ref("newPassWord"), null],
      "Password does not match. Please try again"
    ),
});
