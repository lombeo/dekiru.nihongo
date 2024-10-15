import yup from './yupGlobal'

export const LearningPathSchema = yup.object({
    name: yup.string().trim().required("Learning path title cannot be blank or cannot exceed 200 characters").max(200, "Learning path title cannot be blank or cannot exceed 200 characters").min(3, "Learning path title must have at least 3 characters")
})
