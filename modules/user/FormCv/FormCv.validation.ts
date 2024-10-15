import * as yup from "yup";
import _ from "lodash";

const getSchemaCv = (t: any) => {
  return yup.object().shape({
    name: yup
      .string()
      .required(t("{{name}} must not be blank", { name: t("Expected position") }))
      .trim(t("{{name}} must not be blank", { name: t("Expected position") }))
      .min(
        5,
        t("Minimum {{count}} characters.", {
          count: 5,
        })
      )
      .max(
        255,
        t("Please enter no more than {{count}} characters.", {
          count: 255,
        })
      ),
    cvUrl: yup
      .string()
      .required(t("{{name}} must not be blank", { name: t("CV") }))
      .trim(t("{{name}} must not be blank", { name: t("CV") })),
    careerObjective: yup
      .string()
      .required(t("{{name}} must not be blank", { name: t("Career Objective") }))
      .trim(t("{{name}} must not be blank", { name: t("Career Objective") }))
      .max(
        500,
        t("Please enter no more than {{count}} characters.", {
          count: 500,
        })
      ),
    workingTypeId: yup.lazy((value) =>
      _.isString(value)
        ? yup
            .string()
            .required(t("{{name}} must not be blank", { name: t("Type of employment") }))
            .trim(t("{{name}} must not be blank", { name: t("Type of employment") }))
        : yup
            .number()
            .nullable()
            .required(t("{{name}} must not be blank", { name: t("Type of employment") }))
    ),
    literacyId: yup.lazy((value) =>
      _.isString(value)
        ? yup
            .string()
            .required(t("{{name}} must not be blank", { name: t("Degree") }))
            .trim(t("{{name}} must not be blank", { name: t("Degree") }))
        : yup
            .number()
            .nullable()
            .required(t("{{name}} must not be blank", { name: t("Degree") }))
    ),
    experienceId: yup.lazy((value) =>
      _.isString(value)
        ? yup
            .string()
            .required(t("{{name}} must not be blank", { name: t("Experience") }))
            .trim(t("{{name}} must not be blank", { name: t("Experience") }))
        : yup
            .number()
            .nullable()
            .required(t("{{name}} must not be blank", { name: t("Experience") }))
    ),
    expectSalary: yup.lazy((value) =>
      _.isString(value)
        ? yup
            .string()
            .required(t("{{name}} must not be blank", { name: t("Salary") }))
            .trim(t("{{name}} must not be blank", { name: t("Salary") }))
        : yup
            .number()
            .nullable()
            .required(t("{{name}} must not be blank", { name: t("Salary") }))
            .min(0.1, t("{{name}} must not be blank", { name: t("Salary") }))
    ),
    expectLevelId: yup.lazy((value) =>
      _.isString(value)
        ? yup
            .string()
            .required(t("{{name}} must not be blank", { name: t("Expected job level") }))
            .trim(t("{{name}} must not be blank", { name: t("Expected job level") }))
        : yup
            .number()
            .nullable()
            .required(t("{{name}} must not be blank", { name: t("Expected job level") }))
    ),
    currentLevelId: yup.lazy((value) =>
      _.isString(value)
        ? yup
            .string()
            .required(t("{{name}} must not be blank", { name: t("Current level") }))
            .trim(t("{{name}} must not be blank", { name: t("Current level") }))
        : yup
            .number()
            .nullable()
            .required(t("{{name}} must not be blank", { name: t("Current level") }))
    ),
    industryIds: yup
      .array()
      .nullable()
      .required(t("{{name}} must not be blank", { name: t("Industry") }))
      .min(1, t("{{name}} must not be blank", { name: t("Industry") })),
    workplaces: yup
      .array()
      .nullable()
      .required(t("{{name}} must not be blank", { name: t("Workplace") }))
      .min(1, t("{{name}} must not be blank", { name: t("Workplace") })),
    skills: yup.array().nullable().max(10, t("You are only allowed to create a maximum of 10 skill")),
    agree: yup
      .boolean()
      .nullable()
      .required(t("You have not agreed to our Terms of Service and Privacy Policy"))
      .isTrue(t("You have not agreed to our Terms of Service and Privacy Policy")),
  });
};

export default getSchemaCv;
