import yup from "./yupGlobal";

export const SyncCourseSchema = yup.object({
  courseCodes: (yup.mixed() as any)
    .validateTagsElementRangeLength(1, 1000, "Course code  must be greater than 5 and smaller than 20 characters")
    .validateTotalTags("You are only allowed to create a maximum of 5 course codes"),
});
