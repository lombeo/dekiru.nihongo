import yup from './yupGlobal'

//Question validation
export const LearningOutcomeFormSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('Learning outcome name is required')
    .max(4096, 'Learning outcome name must no exceed 4096 characters'),
  code: yup
    .string()
    .trim()
    .required('Code is required')
    .min(1, 'Learning outcome code must be greater than 1 characters')
    .max(8, 'Learning outcome code must no exceed 8 characters'),
  noDes: yup
    .string()
    .trim()
    .nullable(true)
    .max(100, 'No des must no exceed 100 characters'),
})
