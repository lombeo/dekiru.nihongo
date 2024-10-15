import * as yup from "yup";
import moment from "moment";
import _ from "lodash";

const getSchemaJobManagement = (t: any) => {
  return yup.object().shape({
    title: yup
      .string()
      .required(t("{{name}} must not be blank", { name: t("Title") }))
      .trim(t("{{name}} must not be blank", { name: t("Title") }))
      .max(
        255,
        t("Please enter no more than {{count}} characters.", {
          count: 255,
        })
      ),
    // permalink: yup
    //   .string()
    //   .required(t("{{name}} must not be blank", { name: t("Permalink") }))
    //   .trim(t("{{name}} must not be blank", { name: t("Permalink") }))
    //   .max(
    //     100,
    //     t("Please enter no more than {{count}} characters.", {
    //       count: 100,
    //     })
    //   ),
    externalink: yup
      .string()
      .nullable()
      .max(
        255,
        t("Please enter no more than {{count}} characters.", {
          count: 255,
        })
      ),
    parentCompanyId: yup.lazy((value) =>
      _.isString(value)
        ? yup
            .string()
            .required(t("{{name}} must not be blank", { name: t("Company") }))
            .trim(t("{{name}} must not be blank", { name: t("Company") }))
        : yup
            .number()
            .nullable()
            .required(t("{{name}} must not be blank", { name: t("Company") }))
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
    jobLevelId: yup.lazy((value) =>
      _.isString(value)
        ? yup
            .string()
            .required(t("{{name}} must not be blank", { name: t("Job level") }))
            .trim(t("{{name}} must not be blank", { name: t("Job level") }))
        : yup
            .number()
            .nullable()
            .required(t("{{name}} must not be blank", { name: t("Job level") }))
    ),
    genderId: yup.lazy((value) =>
      _.isString(value)
        ? yup
            .string()
            .required(t("{{name}} must not be blank", { name: t("Gender requirement") }))
            .trim(t("{{name}} must not be blank", { name: t("Gender requirement") }))
        : yup
            .number()
            .nullable()
            .required(t("{{name}} must not be blank", { name: t("Gender requirement") }))
    ),
    numberOfRecruitment: yup.lazy((value) =>
      _.isString(value)
        ? yup
            .string()
            .required(t("{{name}} must not be blank", { name: t("Number of recruitment") }))
            .trim(t("{{name}} must not be blank", { name: t("Number of recruitment") }))
        : yup
            .number()
            .nullable()
            .required(t("{{name}} must not be blank", { name: t("Number of recruitment") }))
    ),
    probationDuration: yup.lazy((value) => (_.isString(value) ? yup.string().nullable() : yup.number().nullable())),
    submissionDeadline: yup
      .date()
      .nullable()
      .required(t("{{name}} must not be blank", { name: t("Submission deadline") }))
      .min(
        moment().subtract(1, "day").endOf("day").toDate(),
        t("{{name}} must be greater than the current time", { name: t("Submission deadline") })
      ),
    requiredSkill: yup.array().nullable().max(10, t("You are only allowed to create a maximum of 10 required skill")),
    fullDescription: yup
      .string()
      .required(t("{{name}} must not be blank", { name: t("Job descriptions") }))
      .trim(t("{{name}} must not be blank", { name: t("Job descriptions") })),
    requirement: yup
      .string()
      .required(t("{{name}} must not be blank", { name: t("Job requirements") }))
      .trim(t("{{name}} must not be blank", { name: t("Job requirements") })),
    benefits: yup
      .string()
      .required(t("{{name}} must not be blank", { name: t("Benefits") }))
      .trim(t("{{name}} must not be blank", { name: t("Benefits") })),
    // shortDescription: yup
    //   .string()
    //   .required(t("{{name}} must not be blank", { name: t("Short descriptions") }))
    //   .trim(t("{{name}} must not be blank", { name: t("Short descriptions") }))
    //   .max(
    //     255,
    //     t("Please enter no more than {{count}} characters.", {
    //       count: 255,
    //     })
    //   ),
    industryIds: yup
      .array()
      .nullable()
      .required(t("{{name}} must not be blank", { name: t("Industry") }))
      .min(1, t("{{name}} must not be blank", { name: t("Industry") })),
    minSalary: yup.lazy((value) =>
      _.isString(value)
        ? yup.string().test(
            "minSalaryRequiredStr",
            t("{{name}} must not be blank", {
              name: t("Minimum salary"),
            }),
            (value, schema) => {
              return schema.parent.isNegotiateSalary || schema.parent.isNoSalary ? true : !!value;
            }
          )
        : yup
            .number()
            .nullable()
            .test(
              "minSalaryRequired",
              t("{{name}} must not be blank", {
                name: t("Minimum salary"),
              }),
              (value, schema) => {
                return schema.parent.isNegotiateSalary || schema.parent.isNoSalary ? true : !!value;
              }
            )
            .min(
              0,
              t("{{from}} must be greater than or equal to {{to}}", {
                from: t("Minimum salary"),
                to: 0,
              })
            )
            .max(
              999,
              t("{{from}} must be less than {{to}}", {
                from: t("Minimum salary"),
                to: "999 " + t("million"),
              })
            )
            .test(
              "minSalaryCustom",
              t("{{from}} must be less than {{to}}", {
                from: t("Minimum salary"),
                to: t("maximum salary"),
              }),
              (value, schema) =>
                schema.parent.isNegotiateSalary || schema.parent.isNoSalary
                  ? true
                  : schema.parent.maxSalary
                  ? value < schema.parent.maxSalary
                  : true
            )
    ),
    maxSalary: yup.lazy((value) =>
      _.isString(value)
        ? yup.string().test(
            "maxSalaryRequiredStr",
            t("{{name}} must not be blank", {
              name: t("Maximum salary"),
            }),
            (value, schema) => {
              return schema.parent.isNegotiateSalary || schema.parent.isNoSalary ? true : !!value;
            }
          )
        : yup
            .number()
            .nullable()
            .test(
              "maxSalaryRequired",
              t("{{name}} must not be blank", {
                name: t("Maximum salary"),
              }),
              (value, schema) => {
                return schema.parent.isNegotiateSalary || schema.parent.isNoSalary ? true : !!value;
              }
            )
            .max(
              999,
              t("{{from}} must be less than {{to}}", {
                from: t("Maximum salary"),
                to: "999 " + t("million"),
              })
            )
            .test(
              "maxSalaryCustom",
              t("{{from}} must be greater than {{to}}", {
                from: t("Maximum salary"),
                to: t("minimum salary"),
              }),
              (value, schema) =>
                schema.parent.isNegotiateSalary || schema.parent.isNoSalary
                  ? true
                  : schema.parent.minSalary
                  ? value > schema.parent.minSalary
                  : true
            )
    ),
    minAge: yup.lazy((value) =>
      _.isString(value)
        ? yup.string().nullable()
        : yup
            .number()
            .nullable()
            .min(
              15,
              t("{{from}} must be greater than {{to}}", {
                from: t("Minimum age"),
                to: 15,
              })
            )
            .max(
              60,
              t("{{from}} must be less than {{to}}", {
                from: t("Minimum age"),
                to: 60,
              })
            )
            .test(
              "minAgeCustom",
              t("{{from}} must be less than {{to}}", {
                from: t("Minimum age"),
                to: t("maximum age"),
              }),
              (value, schema) => (schema.parent.maxAge ? value < schema.parent.maxAge : true)
            )
    ),
    maxAge: yup.lazy((value) =>
      _.isString(value)
        ? yup.string().nullable()
        : yup
            .number()
            .nullable()
            .min(
              15,
              t("{{from}} must be greater than {{to}}", {
                from: t("Minimum age"),
                to: 15,
              })
            )
            .max(
              60,
              t("{{from}} must be less than {{to}}", {
                from: t("Maximum age"),
                to: 60,
              })
            )
            .test(
              "maxAgeCustom",
              t("{{from}} must be greater than {{to}}", {
                from: t("Maximum age"),
                to: t("minimum age"),
              }),
              (value, schema) => (schema.parent.minAge ? value > schema.parent.minAge : true)
            )
    ),
    workplaces: yup.array().of(
      yup.object().shape({
        address: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("House number, road name") }))
          .trim(t("{{name}} must not be blank", { name: t("House number, road name") }))
          .max(
            255,
            t("Please enter no more than {{count}} characters.", {
              count: 255,
            })
          ),
        stateId: yup.lazy((value) =>
          _.isString(value)
            ? yup
                .string()
                .required(t("{{name}} must not be blank", { name: t("Province/City") }))
                .trim(t("{{name}} must not be blank", { name: t("Province/City") }))
            : yup
                .number()
                .nullable()
                .required(t("{{name}} must not be blank", { name: t("Province/City") }))
        ),
      })
    ),
    contactInfo: yup.object().shape({
      fullName: yup
        .string()
        .required(t("{{name}} must not be blank", { name: t("Full name") }))
        .trim(t("{{name}} must not be blank", { name: t("Full name") }))
        .max(
          255,
          t("Please enter no more than {{count}} characters.", {
            count: 255,
          })
        ),
      phoneNumber: yup
        .string()
        .required(t("{{name}} must not be blank", { name: t("Phone number") }))
        .trim(t("{{name}} must not be blank", { name: t("Phone number") }))
        .matches(/(^[0-9\-\+]{1})+([0-9]{9,12})$/g, t("You must enter a valid phone number.")),
      email: yup
        .string()
        .required(t("{{name}} must not be blank", { name: t("Email") }))
        .trim(t("{{name}} must not be blank", { name: t("Email") }))
        .email(t("Invalid email"))
        .max(
          255,
          t("Please enter no more than {{count}} characters.", {
            count: 255,
          })
        ),
      address: yup
        .string()
        .required(t("{{name}} must not be blank", { name: t("Address") }))
        .trim(t("{{name}} must not be blank", { name: t("Address") }))
        .max(
          255,
          t("Please enter no more than {{count}} characters.", {
            count: 255,
          })
        ),
    }),
  });
};

export default getSchemaJobManagement;
